// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs::write;

use active_win_pos_rs::get_active_window;
use serde::Serialize;
use tauri::generate_handler;
use tauri::Emitter;
use tauri::Manager;

#[derive(Clone, Serialize)]
#[serde(rename_all = "camelCase")]
struct Note {
    title: String,
    content: String,
}

#[tauri::command]
async fn save_note_content(content: String) {
    println!("save content: {:#?}", content);
    let _ = write("/home/rmex/Repos/rd/todo.md", content);
}

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            #[cfg(desktop)]
            {
                use tauri_plugin_global_shortcut::{
                    Code, GlobalShortcutExt, Modifiers, Shortcut, ShortcutState,
                };
                let meta_space_shortcut = Shortcut::new(Some(Modifiers::META), Code::Space);
                app.handle().plugin(
                    tauri_plugin_global_shortcut::Builder::new()
                        .with_handler(move |_app, shortcut, event| {
                            if shortcut == &meta_space_shortcut
                                && event.state() == ShortcutState::Released
                            {
                                if let Some(floating_window) = _app.get_webview_window("note") {
                                    let is_visible = floating_window.is_visible().unwrap_or(false);

                                    if is_visible {
                                        let _ = _app.emit_to("note", "note-close", "");
                                        let _ = floating_window.hide();
                                    } else {
                                        use std::fs::read_to_string;

                                        let active_window = get_active_window();
                                        println!("active window: {:#?}", active_window);
                                        // floating_window.set_title(active_window.unwrap().title);
                                        let file_contents =
                                            read_to_string("/home/rmex/Repos/rd/todo.md").unwrap();
                                        // println!("{:#?}", file_contents);
                                        let _ = floating_window.show();
                                        let _ = floating_window.set_focus();
                                        let _ = _app
                                            .emit_to(
                                                "note",
                                                "note-open",
                                                Note {
                                                    title: active_window.unwrap().title,
                                                    content: file_contents,
                                                },
                                            )
                                            .unwrap();
                                    }
                                }
                            }
                        })
                        .build(),
                )?;
                app.global_shortcut().register(meta_space_shortcut)?;
            }
            Ok(())
        })
        .invoke_handler(generate_handler![save_note_content])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

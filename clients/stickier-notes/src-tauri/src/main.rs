// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use active_win_pos_rs::get_active_window;
use tauri::Emitter;
use tauri::Manager;

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
                                        let _ = floating_window.hide();
                                    } else {
                                        let active_window = get_active_window();
                                        println!("active window: {:#?}", active_window);
                                        // floating_window.set_title(active_window.unwrap().title);
                                        let _ = floating_window.show();
                                        let _ = floating_window.set_focus();
                                        let _ = _app
                                            .emit_to(
                                                "note",
                                                "update-title",
                                                active_window.unwrap().title,
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
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

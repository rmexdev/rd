// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use active_win_pos_rs::get_active_window;

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
                        .with_handler(move |app, shortcut, event| {
                            if shortcut == &meta_space_shortcut
                                && event.state() == ShortcutState::Released
                            {
                                use tauri::Manager;
                                if let Some(floating_window) = app.get_webview_window("notes") {
                                    let is_visible = floating_window.is_visible().unwrap_or(false);

                                    if is_visible {
                                        let _ = floating_window.hide();
                                    } else {
                                        let active_window = get_active_window();
                                        println!("active window: {:#?}", active_window);
                                        let _ = floating_window.show();
                                        let _ = floating_window.set_focus();
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

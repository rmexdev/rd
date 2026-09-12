// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// use tauri::WebviewWindowBuilder;
use active_win_pos_rs::get_active_window;

fn main() {
  match get_active_window() {
    Ok(active_window) => {
      println!("active window: {:#?}", active_window)
    }
    Err(()) => {
      println!("error occured")
    }
  }

  tauri::Builder::default()
    .setup(|app| {
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

// fn generate_context() -> tauri::Context {
//   let mut context = tauri::generate_context!("../tauri.conf.json");
//   for cmd in [
//     "plugin:event|listen",
//     "plugin:event|emit",
//     "plugin:event|emit_to",
//     "plugin:webview|create_webview_window",
//   ] {
//     context
//       .runtime_authority_mut()
//       .__allow_command(cmd.to_string(), tauri_utils::acl::ExecutionContext::Local);
//   }
//   context
// }

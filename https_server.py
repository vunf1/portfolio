import asyncio
import ssl
import http.server
import socketserver
import websockets
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import threading
import os

PORT = 444
CERT_FILE = "cert.pem"
KEY_FILE = "key.pem"
WATCH_DIR = '.'

clients = set()


class MyHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Inject WebSocket client script into HTML responses
        if self.path.endswith(".html"):
            self.wfile.write(b"""
            <script>
                const ws = new WebSocket("wss://localhost:8765");
                ws.onmessage = () => location.reload();
            </script>
            """)
        super().end_headers()

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length).decode('utf-8')
        print(f"Received POST request:\n{post_data}")

        # Respond to client
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain')
        self.end_headers()
        self.wfile.write(b"POST received successfully")


def serve_https():
    httpd = socketserver.TCPServer(('localhost', PORT), MyHandler)
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile=CERT_FILE, keyfile=KEY_FILE)
    httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
    print(f"Serving HTTPS on https://localhost:{PORT}")
    httpd.serve_forever()


async def ws_handler(websocket):
    clients.add(websocket)
    try:
        await websocket.wait_closed()
    finally:
        clients.remove(websocket)


async def notify_clients():
    if clients:
        await asyncio.gather(*(ws.send("reload") for ws in clients))


class ReloadHandler(FileSystemEventHandler):
    def on_modified(self, event):
        if not event.is_directory:
            asyncio.run_coroutine_threadsafe(notify_clients(), asyncio.get_event_loop())


def start_watcher():
    observer = Observer()
    observer.schedule(ReloadHandler(), path=WATCH_DIR, recursive=True)
    observer.start()


async def main():
    # Start file watcher in separate thread
    threading.Thread(target=start_watcher, daemon=True).start()

    # Start HTTPS server in separate thread
    threading.Thread(target=serve_https, daemon=True).start()

    # Start WebSocket server
    ssl_context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    ssl_context.load_cert_chain(CERT_FILE, KEY_FILE)
    async with websockets.serve(ws_handler, 'localhost', 8765, ssl=ssl_context):
        await asyncio.Future()  # Run forever


if __name__ == '__main__':
    asyncio.run(main())

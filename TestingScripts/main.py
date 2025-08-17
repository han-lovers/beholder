import pynput.keyboard as keyboard
import datetime
import time
import pyautogui
import re
from google import genai
from pathlib import Path
import base64
from io import BytesIO
import requests
import os
import threading
import tkinter as tk
from tkinter import messagebox
import signal
import psutil
import platform
import queue
import uuid

DATA_DIR = Path(__file__).parent / "data"
DATA_DIR.mkdir(exist_ok=True)
ID_FILE = DATA_DIR / "parent_id.txt"


def get_mac_address():
    return ":".join(
        ["{:02x}".format((uuid.getnode() >> ele) & 0xFF) for ele in range(0, 8 * 6, 8)][
            ::-1
        ]
    )


def get_valid_parent_id():
    # Intentar leer parent_id guardado
    mac_address = get_mac_address()
    if ID_FILE.exists():
        parent_id = ID_FILE.read_text().strip()
        payload = {"id": parent_id, "mac": mac_address}
        try:
            response = requests.post(
                "https://api-257470668223.us-central1.run.app/v1/key_logger/connect",
                json=payload,
            )
            data = response.json()
            if response.status_code == 200:
                print(f"Login automático con parent_id: {parent_id}")
                return parent_id
            else:
                print(
                    f"El id guardado no funcionó: {data.get('error', 'Error desconocido')}"
                )
        except Exception as e:
            print(f"No se pudo validar parent_id guardado: {e}")

    # Si no existe o no es válido, pedir input
    while True:
        parent_id = input("Introduce el parent_id del padre: ").strip()
        payload = {"id": parent_id, "mac": mac_address}
        try:
            response = requests.post(
                "https://api-257470668223.us-central1.run.app/v1/key_logger/connect",
                json=payload,
            )
            data = response.json()
            if response.status_code == 200:
                ID_FILE.write_text(parent_id)
                print(f"Login realizado con parent_id: {data.get('parent_id')}")
                return parent_id
            else:
                print(
                    f"Error al validar parent_id: {data.get('error', 'Error desconocido')}"
                )
        except Exception as e:
            print(f"Error al validar parent_id: {e}")


class SafetyAlertGUI:
    def __init__(
        self, on_timeout_or_no_understanding, message_text=None, required_phrase=None
    ):
        self.alert_active = False
        self.on_timeout_or_no_understanding = on_timeout_or_no_understanding
        self.message_text = (
            message_text
            or """RECORDATORIO IMPORTANTE:

• Nunca compartas tu información personal
• No digas tu nombre real, dirección o teléfono  
• No envíes fotos tuyas
• Si alguien te pide datos personales, habla con un adulto"""
        )
        self.required_phrase = required_phrase or "Entiendo las reglas de seguridad"
        self.root = None
        self.countdown_label = None
        self.input_entry = None

    def show_alert(self):
        if self.alert_active:
            return
        self.alert_active = True
        self.create_alert_window()

    def create_alert_window(self):
        # Create a new root window for this alert
        self.root = tk.Tk()
        self.root.title("⚠️ Alerta de Seguridad")

        # Set a larger size to ensure everything is visible
        self.root.geometry("1000x1000")
        self.root.configure(bg="#e6f0fa")
        self.root.resizable(False, False)
        self.root.protocol("WM_DELETE_WINDOW", lambda: None)
        self.root.attributes("-topmost", True)

        # Center the window
        self.root.update_idletasks()
        x = (self.root.winfo_screenwidth() // 2) - (700 // 2)
        y = (self.root.winfo_screenheight() // 2) - (550 // 2)
        self.root.geometry(f"1000x1000+{x}+{y}")

        self.root.lift()
        self.root.focus_force()

        # Main container with more padding
        main_frame = tk.Frame(self.root, bg="#e6f0fa", padx=40, pady=40)
        main_frame.pack(fill="both", expand=True)

        # Title with better spacing
        title_label = tk.Label(
            main_frame,
            text="⚠️ Alerta de Seguridad ⚠️",
            font=("Arial", 20, "bold"),
            fg="#2c3e50",
            bg="#e6f0fa",
        )
        title_label.pack(pady=(0, 30))

        # Message text with better formatting
        message_label = tk.Label(
            main_frame,
            text=self.message_text,
            font=("Arial", 14),
            fg="#34495e",
            bg="#e6f0fa",
            justify="left",
            wraplength=600,
        )
        message_label.pack(pady=(0, 30))

        # Instruction text
        instruction_label = tk.Label(
            main_frame,
            text="Para continuar, escribe exactamente la siguiente frase:",
            font=("Arial", 14),
            fg="#34495e",
            bg="#e6f0fa",
        )
        instruction_label.pack(pady=(0, 15))

        # Required phrase in a box
        phrase_frame = tk.Frame(main_frame, bg="#d5dbdb", relief="solid", bd=2)
        phrase_frame.pack(pady=(0, 25), padx=20, fill="x")

        phrase_label = tk.Label(
            phrase_frame,
            text=f"'{self.required_phrase}'",
            font=("Arial", 16, "italic"),
            fg="#2c3e50",
            bg="#d5dbdb",
            pady=15,
        )
        phrase_label.pack()

        # Input entry with better styling
        self.input_entry = tk.Entry(
            main_frame,
            width=40,
            font=("Arial", 16),
            justify="center",
            bg="#ffffff",
            fg="#2c3e50",
            bd=3,
            relief="solid",
        )
        self.input_entry.pack(pady=(0, 25))
        self.input_entry.bind("<Return>", lambda event: self.handle_response())
        self.input_entry.focus_set()

        # Button with better styling
        confirm_button = tk.Button(
            main_frame,
            text="Confirmar y Continuar",
            font=("Arial", 16, "bold"),
            bg="#3498db",
            fg="white",
            padx=40,
            pady=20,
            command=self.handle_response,
            relief="flat",
            activebackground="#2980b9",
            cursor="hand2",
        )
        confirm_button.pack(pady=(0, 20))

        # Countdown with better visibility
        self.countdown_label = tk.Label(
            main_frame,
            text="Tiempo restante: 10 segundos",
            font=("Arial", 14, "bold"),
            fg="#e74c3c",
            bg="#e6f0fa",
        )
        self.countdown_label.pack()

        # Start countdown and make modal
        self.start_countdown(remaining=10)
        self.root.grab_set()

        # Start the mainloop for this window
        self.root.mainloop()

    def start_countdown(self, remaining=10):
        if remaining > 0 and self.alert_active and self.root:
            try:
                self.countdown_label.config(
                    text=f"Tiempo restante: {remaining} segundos"
                )
                self.root.after(1000, lambda: self.start_countdown(remaining - 1))
            except tk.TclError:
                # Window was destroyed
                pass
        else:
            if self.alert_active and self.root:
                try:
                    self.countdown_label.config(text="¡Tiempo agotado!")
                    self.alert_active = False
                    self.on_timeout_or_no_understanding()
                    self.root.quit()
                    self.root.destroy()
                except tk.TclError:
                    pass

    def handle_response(self):
        if not self.root:
            return

        try:
            user_input = self.input_entry.get().strip()
            if user_input == self.required_phrase:
                self.alert_active = False
                print("Usuario confirmó correctamente.")
                messagebox.showinfo(
                    "¡Éxito!",
                    "Has confirmado las reglas de seguridad. Puedes continuar.",
                    parent=self.root,
                )
                self.root.quit()
                self.root.destroy()
            else:
                self.alert_active = False
                print("Frase incorrecta - cerrando el juego por seguridad.")
                messagebox.showwarning(
                    "¡Frase Incorrecta!",
                    "La frase que escribiste no es correcta. El juego se cerrará por tu seguridad.",
                    parent=self.root,
                )
                self.on_timeout_or_no_understanding()
                self.root.quit()
                self.root.destroy()
        except tk.TclError:
            # Window was destroyed
            pass


class SafetyAlertSystem:
    def __init__(self):
        self.alert_active = False

    def show_safety_alert_in_thread(self):
        """Shows the safety alert in a separate thread"""
        if self.alert_active:
            print("Alert already active, skipping...")
            return

        self.alert_active = True
        print("Mostrando alerta de seguridad...")

        try:
            # Create and show the alert GUI
            alert_gui = SafetyAlertGUI(
                on_timeout_or_no_understanding=self.find_and_close_roblox
            )
            alert_gui.show_alert()
        except Exception as e:
            print(f"Error showing alert: {e}")
        finally:
            # Reset the flag after the alert is closed
            self.alert_active = False

    def show_safety_alert(self, parent_root=None):
        """Wrapper that creates alert in a new thread"""
        # Create a new thread for the alert to avoid blocking
        alert_thread = threading.Thread(
            target=self.show_safety_alert_in_thread, daemon=False
        )
        alert_thread.start()

    def find_and_close_roblox(self):
        """Cierra procesos de Roblox de forma multiplataforma"""
        print("\n=== CERRANDO ROBLOX POR SEGURIDAD ===\n")

        roblox_processes = []
        for proc in psutil.process_iter(["pid", "name"]):
            try:
                if "roblox" in proc.info["name"].lower():
                    roblox_processes.append(proc)
                    print(f"Encontrado: {proc.info['name']} (PID: {proc.info['pid']})")
            except:
                pass

        if not roblox_processes:
            print("No se encontraron procesos de Roblox ejecutándose")
            return

        for proc in roblox_processes:
            pid = proc.info["pid"]
            name = proc.info["name"]
            print(f"\nIntentando cerrar {name} (PID: {pid})...")

            try:
                if platform.system() == "Windows":
                    proc.terminate()
                    proc.wait(timeout=15)
                else:
                    os.kill(pid, signal.SIGKILL)
                print(f"✅ {name} cerrado")
            except psutil.NoSuchProcess:
                print(f"⚠️ Proceso {pid} ya no existe")
            except psutil.AccessDenied:
                print(f"⚠️ Sin permisos para cerrar proceso {pid}")
            except Exception as e:
                print(f"❌ Error: {e}")


class SmartChatKeylogger:
    def __init__(self, parent_id=None):
        self.captured_text = ""
        self.current_sequence = ""
        self.listener = None
        self.running = False
        self.last_key_time = time.time()

        # Queue para comunicación entre threads
        self.alert_queue = queue.Queue()

        # Tkinter root window (hidden) - esto se ejecuta en el thread principal
        self.root = None
        self.alert_system = SafetyAlertSystem()

        # Thread para Tkinter
        self.tkinter_thread = None
        self.tkinter_running = False

        self.parent_id = parent_id or "DESCONOCIDO"
        print(f"Keylogger iniciado por: {self.parent_id}")

        # Gaming keys that create noise
        self.gaming_keys = {
            "w",
            "a",
            "s",
            "d",
            "q",
            "e",
            "r",
            "f",
            "g",
            "h",
            "z",
            "x",
            "c",
            "v",
        }

        # Chat indicators
        self.chat_indicators = {
            "enter_pressed": False,
            "has_spaces": False,
            "has_letters": False,
            "sequence_length": 0,
            "typing_speed": 0,
        }

        self.client = genai.Client(api_key="AIzaSyCWIli5rPeOLSQz-pc1SFTfDX8lBHYLjk0")

        # Diccionario de descripciones para cada tipo de alerta
        self.alert_descriptions = {
            "image_request": "Solicitud de fotos o imágenes personales",
            "meeting_request": "Solicitud de encuentro en persona",
            "location_request": "Solicitud de dirección, ubicación o datos personales",
            "secrecy_request": "Solicitud de mantener conversaciones en secreto",
            "manipulation": "Uso de manipulación emocional o halagos excesivos",
            "gift_offer": "Ofrecimiento de dinero, regalos o recompensas",
            "boundary_test": "Intento de probar límites o presionar fronteras",
            "photo_request": "Solicitud específica de fotografías",
            "personal_info": "Solicitud de información personal",
            "incentive_offer": "Ofrecimiento de incentivos o regalos",
            "inappropriate_content": "Contenido inapropiado o sugerente",
            "grooming_behavior": "Comportamiento típico de grooming detectado",
        }

    def get_alert_description(self, alert_type):
        """Obtiene la descripción de un tipo de alerta"""
        return self.alert_descriptions.get(
            alert_type, "Comportamiento preocupante detectado"
        )

    def start_tkinter_thread(self):
        """Inicia el thread de Tkinter una sola vez"""
        if self.tkinter_thread and self.tkinter_thread.is_alive():
            return

        self.tkinter_running = True
        self.tkinter_thread = threading.Thread(
            target=self.run_tkinter_loop, daemon=True
        )
        self.tkinter_thread.start()

        # Esperar a que Tkinter se inicialice
        time.sleep(0.5)

    def run_tkinter_loop(self):
        """Ejecuta el loop principal de Tkinter en su propio thread"""
        self.root = tk.Tk()
        self.root.withdraw()  # Ocultar la ventana principal
        self.root.title("Keylogger Background")

        # Procesar eventos de la cola cada 100ms
        self.process_alert_queue()

        try:
            self.root.mainloop()
        except:
            pass
        finally:
            self.tkinter_running = False

    def process_alert_queue(self):
        """Procesa eventos de la cola en el thread de Tkinter"""
        try:
            while not self.alert_queue.empty():
                event = self.alert_queue.get_nowait()
                if event == "show_alert":
                    self.alert_system.show_safety_alert(self.root)
        except queue.Empty:
            pass

        # Programar la próxima verificación
        if self.tkinter_running and self.root:
            self.root.after(100, self.process_alert_queue)

    def trigger_safety_alert(self):
        """Coloca un evento en la cola para mostrar la alerta"""
        try:
            self.alert_queue.put("show_alert")
        except:
            print("Error al enviar evento de alerta")

    def analyze_typing_pattern(self, sequence):
        """Analyze if the sequence looks like chat vs gaming"""
        if len(sequence) < 4:
            return False

        # Split into words and filter out WASD-only words
        words = sequence.split()
        wasd_chars = {"w", "a", "s", "d", "W", "A", "S", "D"}

        # Filter out words that only contain W, A, S, D characters
        real_words = []
        for word in words:
            word_chars = set(word.lower())
            # If word contains any character other than W,A,S,D, it's potentially real
            if not word_chars.issubset(wasd_chars):
                real_words.append(word)

        # If no real words remain after filtering, it's gaming noise
        if not real_words:
            return False

        # Reconstruct sequence without WASD-only words
        filtered_sequence = " ".join(real_words)
        if len(filtered_sequence) < 3:
            return False

        # Analyze the filtered sequence
        chars_only = filtered_sequence.replace(" ", "").lower()

        # Check for actual text patterns
        has_vowels = any(c in "aeiou" for c in chars_only)
        has_consonants = any(c in "bcdfghjklmnpqrtvxyz" for c in chars_only)
        has_multiple_words = len(real_words) > 1
        has_numbers = any(c.isdigit() for c in filtered_sequence)

        # Check if it's just repetitive characters
        is_repetitive = len(set(chars_only)) < max(2, len(chars_only) * 0.3)

        # Chat likelihood scoring
        chat_score = 0
        if has_vowels:
            chat_score += 3
        if has_consonants:
            chat_score += 2
        if has_multiple_words:
            chat_score += 4
        if has_numbers:
            chat_score += 1
        if len(filtered_sequence) > 6:
            chat_score += 2
        if not is_repetitive:
            chat_score += 2

        # Must have both vowels and consonants for real text
        if not (has_vowels and has_consonants):
            return False

        return chat_score >= 6

    def on_key_press(self, key):
        """Process each keystroke"""
        current_time = time.time()

        try:
            # Regular character
            char = key.char
            self.current_sequence += char

        except AttributeError:
            # Special keys
            if key == keyboard.Key.space:
                self.current_sequence += " "
                char = " "
            elif key == keyboard.Key.enter:
                # End of chat message - always save if it passes the filter
                if len(
                    self.current_sequence.strip()
                ) > 0 and self.analyze_typing_pattern(self.current_sequence):
                    self.save_chat_message(self.current_sequence)
                self.current_sequence = ""
                return
            elif key == keyboard.Key.backspace:
                if self.current_sequence:
                    self.current_sequence = self.current_sequence[:-1]
                return
            elif key == keyboard.Key.tab:
                self.current_sequence += "\t"
                return
            elif key == keyboard.Key.esc:
                print("\nESC pressed - stopping capture...")
                self.stop_capture()
                return False
            else:
                # Other special keys - don't end sequence immediately
                # Kids might pause while typing
                return

        # Only save very long sequences (likely spam)
        if len(self.current_sequence) > 100:
            if self.analyze_typing_pattern(self.current_sequence):
                self.save_chat_message(self.current_sequence)
            self.current_sequence = ""

        # Clear old sequences only after much longer inactivity
        time_since_last = current_time - self.last_key_time
        if time_since_last > 10:  # 10 seconds of inactivity
            if len(self.current_sequence) > 5 and self.analyze_typing_pattern(
                self.current_sequence
            ):
                self.save_chat_message(self.current_sequence)
            self.current_sequence = ""

        self.last_key_time = current_time

    def clean_wasd_noise(self, text):
        """Remove words that only contain W, A, S, D characters"""
        wasd_chars = {"w", "a", "s", "d"}
        words = text.split()

        # Filter out words that only contain WASD characters
        clean_words = []
        for word in words:
            word_chars = set(word.lower())
            # Keep word only if it contains characters other than W,A,S,D
            if not word_chars.issubset(wasd_chars) and word_chars:
                clean_words.append(word)

        # Join back and clean up extra spaces
        cleaned_text = " ".join(clean_words)
        # Remove multiple spaces
        cleaned_text = " ".join(cleaned_text.split())

        return cleaned_text.strip()

    def save_chat_message(self, message):
        """Save detected chat message with timestamp"""
        # First clean up WASD noise
        cleaned_message = self.clean_wasd_noise(message)

        # Don't save if nothing remains after cleaning
        if not cleaned_message or len(cleaned_message) < 3:
            return

        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        chat_entry = f"[{timestamp}] CHAT: {cleaned_message}\n"

        self.captured_text += chat_entry
        print(f"Chat detected: {cleaned_message[:50]}...")  # Preview

        evaluation = self.evaluate_chats(cleaned_message)

        if evaluation != "normal/none" and evaluation != "NA/NA":
            print(f"⚠️ Contenido preocupante detectado: {evaluation}")
            screenshot = pyautogui.screenshot()
            buffered = BytesIO()
            screenshot.save(buffered, format="PNG")
            screenshot_bytes = buffered.getvalue()

            encoded_screenshot = base64.b64encode(screenshot_bytes).decode("utf-8")

            # Enviar alerta completa en thread separado para no bloquear
            alert_thread = threading.Thread(
                target=self.send_grooming_alert,
                args=(evaluation, encoded_screenshot, cleaned_message),
                daemon=True,
            )
            alert_thread.start()

    def send_grooming_alert(self, evaluation, screenshot, message):
        """Envía alerta completa de grooming y después muestra la alerta de seguridad"""
        try:
            # Parsear el resultado de la evaluación
            if "/" in evaluation:
                alert_type, importance = evaluation.split("/", 1)
            else:
                alert_type = "grooming_behavior"
                importance = "medium"

            # Crear el payload para la alerta de grooming
            grooming_payload = {
                "type": alert_type,
                "importance": importance,
                "parent_id": self.parent_id,
                "description": self.get_alert_description(alert_type),
                "image": screenshot,
                "message": message,  # Agregamos el mensaje original para contexto
                "timestamp": datetime.datetime.now().isoformat(),
            }

            # Enviar la alerta de grooming
            url = "http://127.0.0.1:8000/api/grooming_alerts/"
            response = requests.post(url, json=grooming_payload)
            print(f"Alerta de grooming enviada: {response.status_code}")

            if response.status_code == 200:
                print(f"✅ Alerta de grooming enviada exitosamente")
                print(f"   Tipo: {alert_type}")
                print(f"   Importancia: {importance}")
                print(f"   Descripción: {self.get_alert_description(alert_type)}")

                # También enviar el screenshot al endpoint original (por compatibilidad)
                screenshot_url = "http://127.0.0.1:8000/api/get_screenshot/"
                screenshot_response = requests.post(
                    screenshot_url, json={"screenshot": screenshot}
                )
                print(
                    f"Screenshot adicional enviado: {screenshot_response.status_code}"
                )

                # Mostrar la alerta de seguridad al usuario
                print("Mostrando alerta de seguridad al usuario...")
                self.trigger_safety_alert()
            else:
                print(f"❌ Error enviando alerta de grooming: {response.status_code}")
                try:
                    error_data = response.json()
                    print(f"   Error: {error_data}")
                except:
                    print(f"   Error text: {response.text}")

        except Exception as e:
            print(f"❌ Error crítico enviando alerta de grooming: {e}")
            import traceback

            traceback.print_exc()

    def start_monitoring(self):
        """Start the keylogger"""
        if self.running:
            print("Keylogger is already running!")
            return

        print("Starting smart chat detection...")
        print("This will filter out gaming noise and capture actual conversations")
        print("Press ESC to stop monitoring")

        # Iniciar el thread de Tkinter primero
        self.start_tkinter_thread()

        self.running = True

        # Iniciar listener en thread separado
        self.listener = keyboard.Listener(on_press=self.on_key_press)
        self.listener.start()

        try:
            while self.running:
                time.sleep(0.1)
        except KeyboardInterrupt:
            self.stop_capture()

    def stop_capture(self):
        """Stop capturing and display results"""
        print("\nStopping chat monitoring...")
        self.running = False
        self.tkinter_running = False

        if self.listener:
            self.listener.stop()

        if self.root:
            try:
                self.root.quit()
            except:
                pass

        print("\n" + "=" * 60)
        print("DETECTED CHAT MESSAGES:")
        print("=" * 60)
        if self.captured_text:
            print(self.captured_text)
        else:
            print("No chat messages detected.")
        print("=" * 60)

    def get_chat_messages(self):
        """Return all detected chat messages"""
        return self.captured_text

    def get_recent_chats(self, minutes=30):
        """Get chats from the last X minutes"""
        lines = self.captured_text.split("\n")
        recent_chats = []

        current_time = datetime.datetime.now()
        cutoff_time = current_time - datetime.timedelta(minutes=minutes)

        for line in lines:
            if line.strip() and "CHAT:" in line:
                try:
                    # Extract timestamp
                    timestamp_str = line.split("]")[0][1:]
                    msg_time = datetime.datetime.strptime(
                        timestamp_str, "%Y-%m-%d %H:%M:%S"
                    )

                    if msg_time >= cutoff_time:
                        recent_chats.append(line)
                except:
                    continue

        return "\n".join(recent_chats)

    def evaluate_chats(self, msg):
        """Evaluate chat message using Gemini AI"""
        try:
            response = self.client.models.generate_content(
                model="gemini-1.5-flash",
                contents=f"""
                You are a text pattern analyzer. Analyze the following message for potentially concerning communication patterns.

                Text to analyze: "{msg}"

                Classification categories:
                1. image_request - Requests for photos or images
                2. meeting_request - Requests to meet in person
                3. location_request - Asking for address, location, or personal details
                4. secrecy_request - Asking to keep conversations private or secret
                5. manipulation - Excessive compliments, "special" language, emotional pressure
                6. gift_offer - Offering money, gifts, or rewards
                7. boundary_test - Testing limits or pushing boundaries

                Risk levels: low, medium, high

                Respond ONLY in this format: [category]/[level] or normal/none

                Examples:
                Input: "can you send me a picture"
                Output: image_request/medium

                Input: "we should meet up sometime"
                Output: meeting_request/medium

                Input: "what's your address"
                Output: location_request/high

                Input: "don't tell your parents we talk"
                Output: secrecy_request/high

                Input: "hello how are you today"
                Output: normal/none

                Input: "you're so mature for your age"
                Output: manipulation/medium

                Analyze the message and respond with the format above.
                """,
            )

            if response and hasattr(response, "text") and response.text:
                response_text = response.text.strip().lower()
                if "/" in response_text:
                    parts = response_text.split("/")
                    if len(parts) >= 2:
                        category = parts[0].strip()
                        severity = parts[1].strip()
                        print(f"AI Analysis for '{msg}': {category}/{severity}")
                        return f"{category}/{severity}"

        except Exception as e:
            print(f"AI Error: {e}")

        # Fallback to rule-based if AI fails
        result = self.rule_based_analysis(msg)
        if result != "NA/NA":
            print(f"Rule-based analysis for '{msg}': {result}")
        return result

    def rule_based_analysis(self, msg):
        """Rule-based analysis for concerning patterns"""
        msg_lower = msg.lower().strip()

        # Define concerning patterns and keywords
        photo_keywords = [
            "foto",
            "photo",
            "pic",
            "picture",
            "imagen",
            "selfie",
            "manda",
            "send",
            "envia",
        ]
        meeting_keywords = [
            "vemos",
            "meet",
            "encuentro",
            "reunion",
            "conocer",
            "verse",
            "quedar",
            "salir",
        ]
        location_keywords = [
            "donde vives",
            "direccion",
            "casa",
            "escuela",
            "where do you live",
            "address",
            "location",
        ]
        secrecy_keywords = [
            "secreto",
            "no digas",
            "entre nosotros",
            "secret",
            "dont tell",
            "between us",
            "privado",
        ]
        manipulation_keywords = [
            "especial",
            "madura",
            "diferente",
            "special",
            "mature",
            "unique",
            "regalo",
            "gift",
        ]
        inappropriate_keywords = [
            "sexy",
            "linda",
            "hermosa",
            "cuerpo",
            "body",
            "intimate",
            "beautiful",
            "attractive",
        ]

        # Check for photo requests
        photo_score = sum(1 for keyword in photo_keywords if keyword in msg_lower)
        if photo_score >= 1 and any(
            word in msg_lower for word in ["tu", "tuya", "your", "you"]
        ):
            return "photo_request/high"
        elif photo_score >= 1:
            return "photo_request/medium"

        # Check for meeting requests
        meeting_score = sum(1 for keyword in meeting_keywords if keyword in msg_lower)
        location_score = sum(1 for keyword in location_keywords if keyword in msg_lower)

        if meeting_score >= 1 and location_score >= 1:
            return "meeting_request/high"
        elif meeting_score >= 1:
            return "meeting_request/medium"
        elif location_score >= 1:
            return "location_request/high"

        # Check for secrecy requests
        secrecy_score = sum(1 for keyword in secrecy_keywords if keyword in msg_lower)
        if secrecy_score >= 1:
            return "secrecy_request/high"

        # Check for manipulation
        manipulation_score = sum(
            1 for keyword in manipulation_keywords if keyword in msg_lower
        )
        if manipulation_score >= 2:
            return "manipulation/medium"
        elif manipulation_score >= 1 and len(msg) > 20:  # Longer manipulative messages
            return "manipulation/low"

        # Check for inappropriate content
        inappropriate_score = sum(
            1 for keyword in inappropriate_keywords if keyword in msg_lower
        )
        if inappropriate_score >= 1:
            return "inappropriate_content/medium"

        # Check for gift/incentive offers
        if any(
            word in msg_lower
            for word in ["regalo", "dinero", "money", "gift", "buy", "comprar"]
        ):
            return "gift_offer/medium"

        return "NA/NA"


# Usage
if __name__ == "__main__":
    print(
        "Smart Chat Detection Keylogger with Safety Alert System and Grooming Detection"
    )
    print("Filters out gaming noise (WASD, etc.) and captures actual conversations")
    print("Shows safety alerts when concerning content is detected")
    print("Sends grooming alerts to parent dashboard")
    print()
    parent_id = get_valid_parent_id()
    monitor = SmartChatKeylogger(parent_id=parent_id)
    monitor.start_monitoring()


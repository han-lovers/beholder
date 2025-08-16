import pynput.keyboard as keyboard
import datetime
import time
import pyautogui
import re
from google import genai



class SmartChatKeylogger:
    def __init__(self):
        self.captured_text = ""
        self.current_sequence = ""
        self.listener = None
        self.running = False
        self.last_key_time = time.time()
        
        # Gaming keys that create noise
        self.gaming_keys = {'w', 'a', 's', 'd', 'q', 'e', 'r', 'f', 'g', 'h', 'z', 'x', 'c', 'v'}
        
        # Chat indicators
        self.chat_indicators = {
            'enter_pressed': False,
            'has_spaces': False,
            'has_letters': False,
            'sequence_length': 0,
            'typing_speed': 0
        }

        self.client = genai.Client(api_key = "AIzaSyCWIli5rPeOLSQz-pc1SFTfDX8lBHYLjk0")
        
    def analyze_typing_pattern(self, sequence):
        """Analyze if the sequence looks like chat vs gaming"""
        if len(sequence) < 4:
            return False
            
        # Split into words and filter out WASD-only words
        words = sequence.split()
        wasd_chars = {'w', 'a', 's', 'd'}
        
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
        filtered_sequence = ' '.join(real_words)
        if len(filtered_sequence) < 3:
            return False
            
        # Analyze the filtered sequence
        chars_only = filtered_sequence.replace(' ', '').lower()
        
        # Check for actual text patterns
        has_vowels = any(c in 'aeiou' for c in chars_only)
        has_consonants = any(c in 'bcdfghjklmnpqrtvxyz' for c in chars_only)
        has_multiple_words = len(real_words) > 1
        has_numbers = any(c.isdigit() for c in filtered_sequence)
        
        # Check if it's just repetitive characters
        is_repetitive = len(set(chars_only)) < max(2, len(chars_only) * 0.3)
        
        # Chat likelihood scoring
        chat_score = 0
        if has_vowels: chat_score += 3
        if has_consonants: chat_score += 2
        if has_multiple_words: chat_score += 4
        if has_numbers: chat_score += 1
        if len(filtered_sequence) > 6: chat_score += 2
        if not is_repetitive: chat_score += 2
        
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
                if len(self.current_sequence.strip()) > 0 and self.analyze_typing_pattern(self.current_sequence):
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
            if len(self.current_sequence) > 5 and self.analyze_typing_pattern(self.current_sequence):
                self.save_chat_message(self.current_sequence)
            self.current_sequence = ""
            
        self.last_key_time = current_time
    
    def clean_wasd_noise(self, text):
        """Remove words that only contain W, A, S, D characters"""
        wasd_chars = {'w', 'a', 's', 'd'}
        words = text.split()
        
        # Filter out words that only contain WASD characters
        clean_words = []
        for word in words:
            word_chars = set(word.lower())
            # Keep word only if it contains characters other than W,A,S,D
            if not word_chars.issubset(wasd_chars) and word_chars:
                clean_words.append(word)
        
        # Join back and clean up extra spaces
        cleaned_text = ' '.join(clean_words)
        # Remove multiple spaces
        cleaned_text = ' '.join(cleaned_text.split())
        
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

        # Take screenshot of entire screen
        screenshot = pyautogui.screenshot()

        # Save it
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        screenshot.save(f"C:/Users/josem/Documents/Watchdog/Executables/testing/screenshot_{timestamp}.png")


    
    def start_monitoring(self):
        """Start the keylogger"""
        if self.running:
            print("Keylogger is already running!")
            return
            
        print("Starting smart chat detection...")
        print("This will filter out gaming noise and capture actual conversations")
        print("Press ESC to stop monitoring")
        
        self.running = True
        
        self.listener = keyboard.Listener(on_press=self.on_key_press)
        self.listener.start()
        
        try:
            while self.running:
                time.sleep(0.1)
        except KeyboardInterrupt:
            self.stop_capture()
    
    def stop_capture(self):
        self.evaluate_chats()
        """Stop capturing and display results"""
        print("\nStopping chat monitoring...")
        self.running = False
        if self.listener:
            self.listener.stop()
            
        print("\n" + "="*60)
        print("DETECTED CHAT MESSAGES:")
        print("="*60)
        if self.captured_text:
            print(self.captured_text)
        else:
            print("No chat messages detected.")
        print("="*60)
    
    def get_chat_messages(self):
        """Return all detected chat messages"""
        return self.captured_text
    
    def get_recent_chats(self, minutes=30):
        """Get chats from the last X minutes"""
        lines = self.captured_text.split('\n')
        recent_chats = []
        
        current_time = datetime.datetime.now()
        cutoff_time = current_time - datetime.timedelta(minutes=minutes)
        
        for line in lines:
            if line.strip() and 'CHAT:' in line:
                try:
                    # Extract timestamp
                    timestamp_str = line.split(']')[0][1:]
                    msg_time = datetime.datetime.strptime(timestamp_str, "%Y-%m-%d %H:%M:%S")
                    
                    if msg_time >= cutoff_time:
                        recent_chats.append(line)
                except:
                    continue
                    
        return '\n'.join(recent_chats)
    
    def evaluate_chats(self):
        lines = self.captured_text.split('\n')
        for line in lines:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash", contents=f"In the following message, written in spansih: '{line}', I need you to identify any form of grooming, this message was written by a 12 year old and so have that into consideration to choose the reason of grooming and the severity. Here are a couple examples: Text 1: 'Claro, si quieres te puedo mandar una foto mia, pero tu me tienes que mandar otra' Response: 'Solicitud de fotos/mid' Explanation: 'By asking a 12 year old for a photo, it implies that the other person might want to groom them because it is wrong to solicit photos from minors'. Text 2: 'Si quieres nos podemos ver, tu por donde vives? yo vivo en la Magdalena Contreras'. Response: 'Solicitud de reunion/high'. Explanation: 'Soliciting to meet with a minor is a very grave offense, also, the minor is giving away information about where he lives, which is also very dangerous' write the response in the form '[cause]/[severity]', where severity can be low, mid or high, if there is no grooming respond with 'NA/NA'"
            )
            workedResponse = response.text.split("/")
            cause = workedResponse[0]
            severity = workedResponse[1]

            print(f"for {line}, the response cause of the model is {cause} and the severity is {severity}")

# Usage
if __name__ == "__main__":
    print("Smart Chat Detection Keylogger")
    print("Filters out gaming noise (WASD, etc.) and captures actual conversations")
    print("Install with: pip install pynput")
    print()
    
    monitor = SmartChatKeylogger()
    monitor.start_monitoring()
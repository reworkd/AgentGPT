import tkinter as tk

def update_label():
    label.config(text="Button Clicked!")

# Create the main window
root = tk.Tk()
root.title("Tkinter App")

# Create a label
label = tk.Label(root, text="Hello, Tkinter!")
label.pack(pady=10)

# Create a button
button = tk.Button(root, text="Click Me", command=update_label)
button.pack(pady=10)

# Run the Tkinter main loop
root.mainloop()

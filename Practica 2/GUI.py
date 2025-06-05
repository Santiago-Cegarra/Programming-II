import customtkinter
import tkinter.filedialog as fd
from customtkinter import *
from practica import *

currentFile = None 
processButton = False
root = CTk()
myValue= IntVar()

def loadFiles():
    global currentFile
    ruta_archivo = fd.askopenfilename(filetypes=[("Archivos de texto", "*.txt")])
    if ruta_archivo:
        currentFile = ruta_archivo 
        try:
            with open(ruta_archivo, 'r', encoding='utf-8') as f:
                contenido = f.read()
                texto1.delete("1.0", "end")
                texto1.insert("1.0", contenido)
        except Exception as e:
            texto1.insert("1.0", f"Error al leer el archivo:\n{str(e)}")

def processBtn():
    if currentFile is None:
        texto1.delete("1.0", "end")
        texto1.insert("1.0", "Primero debes cargar\nun archivo de entrada.")
        return
    
    global processButton
    processButton = True
    progressBar.place(relx=0.39, rely=0.9)
    progressBar.set(0)
    progressValue = 1/100
    stepVal=0
    for i in range(100):
        for j in range(1000000):
            pass
        stepVal += progressValue
        progressBar.set(stepVal)
        progressBar.update_idletasks()

def showFileProcessed():
    global currentFile
    if currentFile is None or processButton == False:
        texto2.delete("1.0", "end")
        texto2.insert("1.0", "Primero debes cargar\nun archivo de entrada.")
        return
    archivo_salida = "salidaglifos.txt"
    try:
        procesar_archivos(currentFile, archivo_salida)  # Ejecuta transformación
        with open(archivo_salida, 'r', encoding='utf-8') as f:
            contenido = f.read()
            texto2.delete("1.0", "end")
            texto2.insert("1.0", contenido)
            progressBar.place_forget()
    except Exception as e:
        texto2.delete("1.0", "end")
        texto2.insert("1.0", f"Error al procesar el archivo:\n{str(e)}")

def processTextInput():
    contenido = texto1.get("1.0", "end").strip().splitlines()
    if not contenido or all(line.strip() == "" for line in contenido):
        texto2.delete("1.0", "end")
        texto2.insert("1.0", "Primero ingresa texto en el cuadro de entrada.")
        return
    salida_lineas = []
    for linea in contenido:
        linea = linea.strip()
        if linea == "":
            continue
        if linea == "0":
            break
        try:
            n = int(linea)
        except ValueError:
            salida_lineas.append(f"{linea} ERROR: Formato inválido. No es un número entero.")
            continue

        if not (1 <= n <= 3999):
            salida_lineas.append(f"{linea} ERROR: Número fuera de rango (1-3999).")
            continue
        glifos = procesarGlifos(n)
        salida_lineas.append(f"{n} -> {glifos}")
    texto2.delete("1.0", "end")
    texto2.insert("1.0", "\n".join(salida_lineas))

root.geometry('600x500')
set_appearance_mode('dark')
root.resizable(False, False)

progressBar = CTkProgressBar(root, width=140, variable= myValue, progress_color= "#C850C0")

label = CTkLabel(master=root, text="Transformador De Numeros Glificos", font=("Arial",20) , text_color='WHITE')
label.place(relx=0.25,rely=0.05)

boton1 = CTkButton(master=root, text="Elegir entrada de Archivos", fg_color= "#4158D0", 
                hover_color="#C850C0", command= loadFiles)
boton1.place(relx=0.11,rely=0.7)

texto1 = CTkTextbox(master=root, scrollbar_button_color='purple', corner_radius=15, border_color="purple", border_width=1)
texto1.place(relx=0.1,rely=0.2)

boton2 = CTkButton(master=root, text="Mostrar salida de Archivos", fg_color= "#4158D0", 
                hover_color="#C850C0", command=showFileProcessed)
boton2.place(relx=0.63,rely=0.7)

boton3 = CTkButton(master=root, text="Procesar Entrada", fg_color= "blue", 
                hover_color="#C850C0", command=processBtn)
boton3.place(relx=0.39,rely=0.8)

texto2 = CTkTextbox(master=root, scrollbar_button_color='purple', corner_radius=15, border_color="purple", border_width=1)
texto2.place(relx=0.6,rely=0.2)

boton4 = CTkButton(master=root, text="->",fg_color="#4158D0",     
                hover_color="#C850C0", command=processTextInput, width=10)
boton4.place(relx=0.49, rely=0.4)  


root.mainloop()

def procesar_archivos(archivo_entrada, archivo_salida):
  
    with open(archivo_entrada, 'r') as fileIn, open(archivo_salida, 'w', encoding='utf-8') as fileOut:
        for linea in fileIn:
            linea = linea.strip()
            if linea == "0":
                break
            try:
                n = int(linea)
            except ValueError:
                fileOut.write(f"{linea} ERROR: Formato de entrada invalido. No es un numero.\n")
                continue

            if not (1 <= n <= 3999):
                fileOut.write(f"{linea} ERROR: Numero fuera de rango (1-3999).\n")
                continue
            # AGREGAR FUNCION AQUI
            glifos = procesarGlifos(n)
            fileOut.write(f"{n} -> {glifos}\n")

def procesarGlifos(n):
    result = []
    glifMap = [
        ("Ξ", 1000), ("ΦΞ", 900), ("Ψ", 500), ("ΦΨ", 400),
        ("Φ", 100), ("ΩΦ", 90), ("Δ", 50), ("ΩΔ", 40),
        ("Ω", 10), ("ΣΩ", 9), ("Λ", 5), ("ΣΛ", 4), ("Σ", 1)
    ]
    for glifo, value in glifMap:
        while (n >= value):
            result.append(glifo)
            n -= value
    return "".join(result)



if __name__ == "__main__":
    procesar_archivos("glifos.txt","salidaglifos.txt")
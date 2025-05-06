import sys 

def read_file(name):
    with open(name,'r') as file:
        global content
        content = file.read()
        print(content)
        content = content.replace('\n','')
        content = content.replace('!','.')
        content = content.replace(',','') 
        content = content.replace('.',' ')
        content = content.split(' ')
        content = [string.lower() for string in content]
        content = [palabra for palabra in content if palabra != '']
        
def read_prohibit(name):
    with open(name,'r') as file:
        global prohibit
        prohibit = file.read()
        prohibit = prohibit.split('\n')
       

def countRepetitions():
      global frecuencias 
      frecuencias= {}
      for palabra in content:
            if palabra not in prohibit:
                if palabra in frecuencias:
                    frecuencias[palabra] += 1
                else:
                    frecuencias[palabra] = 1
         
 
def printResults():
     for palabra in sorted(frecuencias.keys()):
        print(f"{palabra}: {frecuencias[palabra]}")

def main():
    read_file("input.in")
    read_prohibit('prohibidas.in')
    countRepetitions()
    printResults()

if __name__ == '__main__':
	main()

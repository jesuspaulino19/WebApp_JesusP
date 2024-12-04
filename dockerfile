# Usar una imagen base oficial de Node.js compatible con tu sistema
FROM node:16-buster

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos de tu aplicación
COPY package*.json ./
COPY . .

# Instalar las dependencias de la aplicación
RUN npm install --force

# Verificar que SQLite esté correctamente instalado
RUN npm rebuild sqlite3 --build-from-source

# Exponer el puerto en el que corre tu aplicación
EXPOSE 777

# Comando para iniciar tu aplicación
CMD ["node", "server.js"]

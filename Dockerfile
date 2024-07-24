# Sử dụng hình ảnh Node.js chính thức làm hình ảnh cơ sở
FROM node:14

# Thiết lập thư mục làm việc trong container
WORKDIR /usr/src/app

# Sao chép các tệp package.json và package-lock.json
COPY package*.json ./

# Cài đặt các gói cần thiết
RUN npm install

# Sao chép toàn bộ mã nguồn vào container
COPY . .

# Mở cổng 8080 để truy cập từ bên ngoài
EXPOSE 8080

# Chạy ứng dụng khi container được khởi động
CMD ["node", "app.js"]

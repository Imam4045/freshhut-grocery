FROM php:8.2-apache

# Enable required PHP extensions for MySQL (PDO) with SSL support
RUN docker-php-ext-install pdo pdo_mysql mysqli

# Enable Apache rewrite module (needed for .htaccess rules)
RUN a2enmod rewrite

# Copy project files into Apache's web root
COPY . /var/www/html/

# Ensure files are readable and uploads folder is writable
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Allow .htaccess overrides
RUN sed -i '/<Directory \/var\/www\/>/,/<\/Directory>/ s/AllowOverride None/AllowOverride All/' /etc/apache2/apache2.conf

# Render provides the PORT env var at runtime — Apache must listen on it
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 10000
CMD ["/entrypoint.sh"]

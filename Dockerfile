FROM php:8.2-apache

# Enable required PHP extensions for MySQL (PDO) with SSL support,
# plus opcache so PHP files are compiled once and cached instead of
# being re-parsed from disk on every single request.
RUN docker-php-ext-install pdo pdo_mysql mysqli opcache

# Opcache settings tuned for a small app like this one.
RUN { \
        echo 'opcache.enable=1'; \
        echo 'opcache.enable_cli=0'; \
        echo 'opcache.memory_consumption=64'; \
        echo 'opcache.interned_strings_buffer=8'; \
        echo 'opcache.max_accelerated_files=4000'; \
        echo 'opcache.revalidate_freq=2'; \
        echo 'opcache.validate_timestamps=1'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini

# Enable Apache rewrite module (needed for .htaccess rules) and
# deflate (gzip compression of responses before they're sent over the network).
RUN a2enmod rewrite deflate

# Compress the response types this app actually serves — HTML, CSS, JS,
# and the JSON your api/*.php endpoints return. Images are already
# compressed formats, so they're deliberately left out.
RUN { \
        echo '<IfModule mod_deflate.c>'; \
        echo '    AddOutputFilterByType DEFLATE text/html text/plain text/css text/xml'; \
        echo '    AddOutputFilterByType DEFLATE application/javascript application/x-javascript'; \
        echo '    AddOutputFilterByType DEFLATE application/json application/xml'; \
        echo '</IfModule>'; \
    } > /etc/apache2/conf-available/deflate-custom.conf \
    && a2enconf deflate-custom

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

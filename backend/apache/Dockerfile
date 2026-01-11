FROM httpd:2.4

# Ativa módulos necessários
RUN sed -i \
    -e 's/^#LoadModule proxy_module/LoadModule proxy_module/' \
    -e 's/^#LoadModule proxy_fcgi_module/LoadModule proxy_fcgi_module/' \
    -e 's/^#LoadModule rewrite_module/LoadModule rewrite_module/' \
    /usr/local/apache2/conf/httpd.conf

# Define ServerName
RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

# Muda o DocumentRoot Padrão
RUN sed -i \
    -e 's|DocumentRoot "/usr/local/apache2/htdocs"|DocumentRoot "/var/www/html/public"|' \
    -e 's|<Directory "/usr/local/apache2/htdocs">|<Directory "/var/www/html/public">|' \
    /usr/local/apache2/conf/httpd.conf

# Copia o vhost
COPY vhost.conf /usr/local/apache2/conf/extra/vhost.conf

# Inclui o vhost
RUN echo "Include /usr/local/apache2/conf/extra/vhost.conf" \
    >> /usr/local/apache2/conf/httpd.conf

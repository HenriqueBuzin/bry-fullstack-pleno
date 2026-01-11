FROM httpd:2.4

# Ativa módulos necessários
RUN sed -i \
    -e 's/^#LoadModule proxy_module/LoadModule proxy_module/' \
    -e 's/^#LoadModule proxy_fcgi_module/LoadModule proxy_fcgi_module/' \
    -e 's/^#LoadModule rewrite_module/LoadModule rewrite_module/' \
    /usr/local/apache2/conf/httpd.conf

RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

# Copia o vhost
COPY vhost.conf /usr/local/apache2/conf/extra/vhost.conf

# Inclui o vhost
RUN echo "Include conf/extra/vhost.conf" \
    >> /usr/local/apache2/conf/httpd.conf

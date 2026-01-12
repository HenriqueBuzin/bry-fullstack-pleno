FROM httpd:2.4

RUN sed -i \
    -e 's/^#LoadModule proxy_module/LoadModule proxy_module/' \
    -e 's/^#LoadModule proxy_fcgi_module/LoadModule proxy_fcgi_module/' \
    -e 's/^#LoadModule rewrite_module/LoadModule rewrite_module/' \
    /usr/local/apache2/conf/httpd.conf

RUN echo "ServerName localhost" >> /usr/local/apache2/conf/httpd.conf

RUN sed -i \
    -e 's|DocumentRoot "/usr/local/apache2/htdocs"|DocumentRoot "/var/www/html/public"|' \
    -e 's|<Directory "/usr/local/apache2/htdocs">|<Directory "/var/www/html/public">|' \
    /usr/local/apache2/conf/httpd.conf

COPY vhost.conf /usr/local/apache2/conf/extra/vhost.conf

RUN echo "Include /usr/local/apache2/conf/extra/vhost.conf" \
    >> /usr/local/apache2/conf/httpd.conf

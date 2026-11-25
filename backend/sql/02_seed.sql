USE novatech_test;

INSERT INTO products (name, description, category, price, specifications)
SELECT 'Servidor Empresarial NovaServer', 'Servidor empresarial para cargas de trabajo y servicios internos.', 'servidores', 48500.00, JSON_OBJECT('cpu','Intel Xeon','ram','64 GB ECC','storage','2 TB SSD')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Servidor Empresarial NovaServer');

INSERT INTO products (name, description, category, price, specifications)
SELECT 'Switch Administrable 24 Puertos', 'Switch administrable para infraestructura de red empresarial.', 'redes', 12900.00, JSON_OBJECT('ports',24,'poe','PoE+','management','Web/SNMP')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Switch Administrable 24 Puertos');

INSERT INTO products (name, description, category, price, specifications)
SELECT 'Firewall Empresarial NovaShield', 'Equipo de seguridad perimetral para protección de la infraestructura.', 'redes', 21800.00, JSON_OBJECT('utm',true,'vpn',true,'ids_ips',true)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Firewall Empresarial NovaShield');

INSERT INTO products (name, description, category, price, specifications)
SELECT 'Workstation NovaTech Pro', 'Estación de trabajo para desarrollo, diseño y operación empresarial.', 'computadoras', 32500.00, JSON_OBJECT('cpu','Core i7','ram','32 GB','gpu','Profesional','storage','1 TB NVMe')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Workstation NovaTech Pro');

INSERT INTO products (name, description, category, price, specifications)
SELECT 'Access Point Empresarial WiFi 6', 'Punto de acceso inalámbrico empresarial de alta capacidad.', 'redes', 5900.00, JSON_OBJECT('wifi','WiFi 6','poe',true,'capacity','Alta')
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Access Point Empresarial WiFi 6');

INSERT INTO products (name, description, category, price, specifications)
SELECT 'Sistema de Respaldo NAS', 'Almacenamiento centralizado para copias de seguridad y archivos.', 'servidores', 28900.00, JSON_OBJECT('capacity','16 TB','raid','RAID 5','backup',true)
WHERE NOT EXISTS (SELECT 1 FROM products WHERE name='Sistema de Respaldo NAS');

INSERT INTO articles (title, category, summary, content, published_at)
SELECT 'Migración a Switches de 10GbE y 100GbE en PYMEs', 'Redes', 'Descubre cuándo es el momento adecuado para actualizar el backbone de tu empresa y evitar cuellos de botella en la red local.', 'Contenido de prueba para el backend de artículos de NovaTech.', '2026-09-14'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Migración a Switches de 10GbE y 100GbE en PYMEs');

INSERT INTO articles (title, category, summary, content, published_at)
SELECT 'Workstations vs. Computadoras de Escritorio', 'Cómputo', 'Análisis comparativo de memoria ECC, GPUs profesionales y procesadores multinúcleo para entornos de alto rendimiento.', 'Contenido de prueba para el backend de artículos de NovaTech.', '2026-09-02'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Workstations vs. Computadoras de Escritorio');

INSERT INTO articles (title, category, summary, content, published_at)
SELECT 'Arquitecturas Híbridas: On-Premise + Cloud', 'Servidores', 'Estrategias para combinar servidores físicos locales con la nube manteniendo latencia mínima y máxima privacidad.', 'Contenido de prueba para el backend de artículos de NovaTech.', '2026-08-20'
WHERE NOT EXISTS (SELECT 1 FROM articles WHERE title='Arquitecturas Híbridas: On-Premise + Cloud');

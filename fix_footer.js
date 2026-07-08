const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');

const heroIndex = indexHtml.indexOf('<section class="hero"');
const footerIndex = indexHtml.indexOf('<footer>');

if (footerIndex === -1) {
    console.error("Footer not found!");
    process.exit(1);
}

const top = indexHtml.substring(0, heroIndex);
const bottom = indexHtml.substring(footerIndex);

const middleContent = `
    <!-- Hero Section Negocio -->
    <section class="hero" style="padding: 120px 0 80px; text-align: center;">
        <div class="container">
            <span class="badge" style="background: rgba(255, 171, 0, 0.1); color: #ffab00; border: 1px solid rgba(255, 171, 0, 0.3);">LA REVOLUCIÓN GLP-1</span>
            <h1 style="font-size: 3.5rem; margin-bottom: 20px;">Tu Oportunidad en el Mercado del Bienestar</h1>
            <p style="font-size: 1.2rem; color: var(--text-muted); max-width: 800px; margin: 0 auto 40px;">
                La industria de los GLP-1 está transformando el mundo del bienestar, pero los métodos actuales tienen altos costes y fricciones. TriGLP es la alternativa natural de última generación en gotas sublinguales. Únete a nuestro movimiento y benefíciate de esta ola sin precedentes.
            </p>
            <img src="assets/images/hero_business_lifestyle.png" alt="Oportunidad de Negocio" style="width: 100%; max-width: 1000px; border-radius: 20px; box-shadow: 0 20px 50px rgba(0,0,0,0.5); object-fit: cover; aspect-ratio: 16/9; margin-bottom: 40px;">
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <a href="https://iorngoldman.orygn.co/" class="btn btn-primary btn-glow" target="_blank" rel="noopener noreferrer">Únete a ORYGN Ahora</a>
                <a href="https://technoeconomia.com/docu-orygn/ORYGN_Comp_Plan_(ES).pdf" class="btn btn-outline" target="_blank">Descargar Plan de Ganancias</a>
            </div>
        </div>
    </section>
    
    <!-- Ventajas (Comparativa) -->
    <section class="section-light" style="padding: 80px 0;">
        <div class="container">
            <h2 style="text-align: center; margin-bottom: 50px;">El Modelo Más Inteligente</h2>
            <div class="compare-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 30px;">
                <div class="compare-card negative" style="background: rgba(255,255,255,0.02); padding: 40px; border-radius: 20px; border: 1px solid var(--border-color);">
                    <h3>Negocio Tradicional</h3>
                    <ul class="feature-list align-left" style="list-style: none; padding: 0; margin-top: 20px;">
                        <li style="margin-bottom: 15px;"><span class="icon">🏢</span> Necesitas un local físico</li>
                        <li style="margin-bottom: 15px;"><span class="icon">📦</span> Gestión de inventario y stock</li>
                        <li style="margin-bottom: 15px;"><span class="icon">🚚</span> Envíos y logística complicados</li>
                        <li style="margin-bottom: 15px;"><span class="icon">💳</span> Riesgo de impagos y devoluciones</li>
                        <li style="margin-bottom: 15px;"><span class="icon">📉</span> Altos costes fijos iniciales</li>
                    </ul>
                </div>
                <div class="compare-card positive" style="background: linear-gradient(145deg, rgba(240, 78, 35, 0.1), rgba(240, 78, 35, 0.05)); padding: 40px; border-radius: 20px; border: 1px solid var(--primary); position: relative;">
                    <div class="popular-tag" style="position: absolute; top: -15px; right: 20px; background: var(--primary); color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.8rem; font-weight: bold;">El Modelo ORYGN</div>
                    <h3>Ser Distribuidor/a</h3>
                    <ul class="feature-list align-left" style="list-style: none; padding: 0; margin-top: 20px;">
                        <li style="margin-bottom: 15px;"><span class="icon">📱</span> Trabaja desde tu móvil o PC donde quieras</li>
                        <li style="margin-bottom: 15px;"><span class="icon">🚫</span> Cero stock, cero envíos, cero devoluciones</li>
                        <li style="margin-bottom: 15px;"><span class="icon">🌐</span> Tu propia tienda online y embudo de ventas</li>
                        <li style="margin-bottom: 15px;"><span class="icon">🗣️</span> Simplemente comparte la información y testimonios</li>
                        <li style="margin-bottom: 15px;"><span class="icon">💰</span> Altas comisiones automatizadas por ORYGN</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Flexibilidad -->
    <section class="glp-compare" style="padding: 80px 0; text-align: center;">
        <div class="container">
            <h2 style="font-size: 2.5rem; margin-bottom: 20px;">Elige Tu Propio Camino</h2>
            <p style="color: var(--text-muted); max-width: 700px; margin: 0 auto 50px;">Esta oportunidad está diseñada para adaptarse a tus objetivos, tu ritmo y tu estilo de vida. Tú decides hasta dónde quieres llegar.</p>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px;">
                <div style="background: var(--bg-card); padding: 40px; border-radius: 20px; border: 1px solid var(--border-color); text-align: left;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🌱</div>
                    <h3>Tus Productos Gratis</h3>
                    <p style="color: var(--text-muted);">¿Te encanta TriGLP? Recomiéndalo a un par de personas en tu entorno y utiliza las comisiones generadas para costear tu propio consumo mensual. ¡Bienestar a coste cero!</p>
                </div>
                <div style="background: var(--bg-card); padding: 40px; border-radius: 20px; border: 1px solid var(--primary); text-align: left; box-shadow: 0 10px 30px rgba(240, 78, 35, 0.1);">
                    <div style="font-size: 3rem; margin-bottom: 20px;">💸</div>
                    <h3>Ingreso Extra</h3>
                    <p style="color: var(--text-muted);">Dedícale unas horas a la semana desde tu smartphone. Genera ese ingreso adicional ideal para pagar deudas, darte caprichos, vacaciones o aumentar tus ahorros de forma flexible.</p>
                </div>
                <div style="background: var(--bg-card); padding: 40px; border-radius: 20px; border: 1px solid var(--border-color); text-align: left;">
                    <div style="font-size: 3rem; margin-bottom: 20px;">🚀</div>
                    <h3>Carrera Profesional</h3>
                    <p style="color: var(--text-muted);">Construye un equipo global. Desarrolla tu liderazgo y accede a comisiones residuales sin límite, fondos globales de empresa y generosos bonos por ayudar a otros a tener éxito.</p>
                </div>
            </div>
            
            <img src="assets/images/secondary_business_lifestyle.png" alt="Estilo de vida y éxito" style="width: 100%; max-width: 900px; border-radius: 20px; margin-top: 60px; object-fit: cover; aspect-ratio: 21/9; box-shadow: 0 15px 40px rgba(0,0,0,0.4);">
        </div>
    </section>

    <!-- CTA Final -->
    <section class="cta-section" style="padding: 100px 0; text-align: center; background: radial-gradient(circle at center, rgba(240, 78, 35, 0.15) 0%, rgba(13, 17, 23, 1) 70%);">
        <div class="container">
            <h2 style="font-size: 3rem; margin-bottom: 20px;">El Momento es Ahora</h2>
            <p style="color: var(--text-muted); max-width: 600px; margin: 0 auto 40px;">No dejes pasar la oportunidad de posicionarte en la vanguardia de una industria que está redefiniendo el bienestar y la salud metabólica.</p>
            <div style="display: flex; gap: 20px; justify-content: center; flex-wrap: wrap;">
                <a href="https://iorngoldman.orygn.co/" class="btn btn-primary btn-glow" style="font-size: 1.2rem; padding: 15px 40px;" target="_blank" rel="noopener noreferrer">Comenzar Ahora</a>
                <a href="https://technoeconomia.com/docu-orygn/ORYGN_Comp_Plan_(ES).pdf" class="btn btn-outline" style="font-size: 1.2rem; padding: 15px 40px;" target="_blank">Ver Detalles del Plan</a>
            </div>
        </div>
    </section>
`;

fs.writeFileSync('negocio.html', top + middleContent + bottom, 'utf8');
console.log('Fixed negocio.html footer bug.');

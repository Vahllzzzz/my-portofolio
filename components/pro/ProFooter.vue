<template>
  <footer class="footer">
    <div class="footer-content">

      <div class="footer-brand">
        <h3>Vahllzzzz</h3>
        <p>
          Frontend Developer • 3D Artist • Beginner Game Developer
        </p>
      </div>

      <div class="footer-links">
        <a href="#about">About</a>
        <a href="#projects">Projects</a>
        <a href="#contact">Contact</a>
      </div>

      <div class="footer-social">
        <a
          href="https://github.com/Vahllzzzz"
          target="_blank"
          rel="noopener"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/reihan-azka-vahlepy"
          target="_blank"
          rel="noopener"
        >
          LinkedIn
        </a>

        <a
          href="mailto:hannvahll09@gmail.com"
        >
          Email
        </a>
      </div>

    </div>

    <div class="footer-bottom">
      © {{ new Date().getFullYear() }}
      Vahllzzzz. Built with Nuxt & Three.js.
    </div>
  </footer>
</template>

<style scoped>
.footer{
  margin-top:120px;
  padding:60px 40px 30px;

  border-top:1px solid var(--border);

  background: var(--bg-card);
}

.footer-content{
  max-width:1200px;
  margin:0 auto;

  display:grid;
  grid-template-columns:
    1.5fr
    1fr
    1fr;

  gap:40px;
}

.footer-brand h3{
  margin:0;
  color: var(--text);
  font-size:1.3rem;
}

.footer-brand p{
  margin-top:12px;

  color: var(--text);
  line-height:1.7;
}

.footer-links,
.footer-social{
  display:flex;
  flex-direction:column;
  gap:12px;
}

.footer-links a,
.footer-social a{
  color: var(--text);
  text-decoration:none;

  transition:.25s;
}

.footer-links a:hover,
.footer-social a:hover{
  color: var(--primary);
  transform:translateX(4px);
}

.footer-bottom{
  max-width:1200px;
  margin:40px auto 0;

  padding-top:24px;

  border-top:1px solid var(--border);

  color: var(--text-muted);
  font-size:.9rem;

  text-align:center;
}

@media (max-width:768px){
  .footer-content{
    grid-template-columns:1fr;
    gap: 32px;
  }

  .footer{
    padding:50px 20px 24px;
    margin-top: 80px;
  }

  .footer-bottom {
    margin: 32px auto 0;
    padding-top: 20px;
  }
}

@media (max-width:560px){
  .footer{
    padding:40px 16px 20px;
    margin-top: 60px;
  }

  .footer-content{
    gap: 24px;
  }

  .footer-brand h3{
    font-size:1.1rem;
  }

  .footer-brand p{
    font-size:0.9rem;
  }

  .footer-links a,
  .footer-social a{
    font-size:0.9rem;
  }

  .footer-bottom{
    font-size:0.85rem;
    margin: 24px auto 0;
    padding-top: 16px;
  }
}
</style>
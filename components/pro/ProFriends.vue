<template>
  <section id="friends" class="friends">
    <div class="section-heading">
      <p>{{ language === 'en' ? 'Friends' : 'Teman' }}</p>
      <h2>
        {{
          language === 'en'
            ? 'People from the NLFTs GitHub community.'
            : 'Orang-orang dari komunitas GitHub NLFTs.'
        }}
      </h2>
      <a href="https://github.com/NLFTs" target="_blank" rel="noopener">
        {{ language === 'en' ? 'View NLFTs on GitHub' : 'Lihat NLFTs di GitHub' }}
      </a>
    </div>

    <div class="friends-grid">
      <a v-for="friend in friends" :key="friend.login" :href="friend.url" target="_blank" rel="noopener" class="friend-card">
        <img :src="friend.avatar" :alt="`@${friend.login}`" loading="lazy" />
        <div>
          <strong>{{ friend.name }}</strong>
          <span>@{{ friend.login }}</span>
        </div>
      </a>
    </div>
  </section>
</template>

<script setup>
import { useLanguage } from "../../composables/useLanguage"

const { language } = useLanguage()

const friends = [
  {
    login: "Barabr0",
    name: "Bara",
    avatar: "https://avatars.githubusercontent.com/u/228843429?s=96&v=4",
    url: "https://github.com/Barabr0"
  },
  {
    login: "davingm",
    name: "Kinn",
    avatar: "https://avatars.githubusercontent.com/u/228851591?s=96&v=4",
    url: "https://github.com/davingm"
  },
  {
    login: "Destkaa",
    name: "KakaViangi",
    avatar: "https://avatars.githubusercontent.com/u/228332586?s=96&v=4",
    url: "https://github.com/Destkaa"
  },
  {
    login: "Fakhri-8G",
    name: "Fakhri",
    avatar: "https://avatars.githubusercontent.com/u/228840381?s=96&v=4",
    url: "https://github.com/Fakhri-8G"
  },
  {
    login: "fandybuilds",
    name: "afandysantosa",
    avatar: "https://avatars.githubusercontent.com/u/216720543?s=96&v=4",
    url: "https://github.com/fandybuilds"
  },
  {
    login: "Ilman91",
    name: "Ilman Abidullah",
    avatar: "https://avatars.githubusercontent.com/u/228839961?s=96&v=4",
    url: "https://github.com/Ilman91"
  },
  {
    login: "lintangnwy",
    name: "LintangNurWijaya",
    avatar: "https://avatars.githubusercontent.com/u/216552062?s=96&v=4",
    url: "https://github.com/lintangnwy"
  },
  {
    login: "Maruu-glitc",
    name: "AmadTemola",
    avatar: "https://avatars.githubusercontent.com/u/225441519?s=96&v=4",
    url: "https://github.com/Maruu-glitc"
  },
  {
    login: "MiftahAja",
    name: "PanggilAjaMip",
    avatar: "https://avatars.githubusercontent.com/u/232498018?s=96&v=4",
    url: "https://github.com/MiftahAja"
  },
  {
    login: "nairha",
    name: "azunya",
    avatar: "https://avatars.githubusercontent.com/u/204519754?s=96&v=4",
    url: "https://github.com/nairha"
  },
  {
    login: "Radiedtya",
    name: "Radiedtya",
    avatar: "https://avatars.githubusercontent.com/u/226198461?s=96&v=4",
    url: "https://github.com/Radiedtya"
  },
  {
    login: "RakhaAZ3",
    name: "Rakha",
    avatar: "https://avatars.githubusercontent.com/u/228839918?s=96&v=4",
    url: "https://github.com/RakhaAZ3"
  },
  {
    login: "Rehan-Ramadhan",
    name: "Rehan Ramadhan",
    avatar: "https://avatars.githubusercontent.com/u/218329504?s=96&v=4",
    url: "https://github.com/Rehan-Ramadhan"
  },
  {
    login: "sidiktsq",
    name: "シディック",
    avatar: "https://avatars.githubusercontent.com/u/230048582?s=96&v=4",
    url: "https://github.com/sidiktsq"
  },
  {
    login: "Tokitakun",
    name: "Nafeez",
    avatar: "https://avatars.githubusercontent.com/u/182593937?s=96&v=4",
    url: "https://github.com/Tokitakun"
  },
  {
    login: "x1aomei",
    name: "Xiao mei",
    avatar: "https://avatars.githubusercontent.com/u/232498781?s=96&v=4",
    url: "https://github.com/x1aomei"
  }
]
</script>

<style scoped>
.friends {
  padding: 96px 40px;
  background: var(--bg);
}

.section-heading,
.friends-grid {
  width: min(1080px, 100%);
  margin-inline: auto;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px 24px;
  align-items: end;
  margin-bottom: 32px;
}

.section-heading p {
  grid-column: 1 / -1;
  margin: 0;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 900;
  text-transform: uppercase;
}

.section-heading h2 {
  max-width: 720px;
  margin: 0;
  color: var(--text);
  font-size: 2.4rem;
  line-height: 1.16;
}

.section-heading a {
  display: inline-flex;
  align-items: center;
  min-height: 42px;
  padding: 0 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--border-dim);
  color: var(--text);
  font-size: 0.85rem;
  font-weight: 800;
  text-decoration: none;
}

.friends-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.friend-card {
  display: flex;
  gap: 12px;
  align-items: center;
  min-width: 0;
  padding: 14px;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--bg-card);
  color: var(--text);
  text-decoration: none;
  transition: border-color 0.2s ease, transform 0.2s ease;
}

.friend-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
}

img {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  border-radius: 999px;
  background: var(--bg-surface);
}

.friend-card div {
  min-width: 0;
}

strong,
span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

strong {
  color: var(--text);
  font-size: 0.95rem;
}

span {
  margin-top: 4px;
  color: var(--text-muted);
  font-size: 0.82rem;
  font-weight: 700;
}

@media (max-width: 1020px) {
  .friends-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .friends {
    padding: 72px 24px;
  }

  .section-heading {
    grid-template-columns: 1fr;
  }

  .friends-grid {
    grid-template-columns: 1fr;
  }

  .section-heading h2 {
    font-size: 2rem;
  }
}
</style>

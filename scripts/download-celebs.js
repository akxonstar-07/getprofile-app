const fs = require('fs');
const path = require('path');

const celebs = [
  { name: 'allu_arjun.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Allu_Arjun_at_Pushpa_trailer_launch.jpg/800px-Allu_Arjun_at_Pushpa_trailer_launch.jpg' },
  { name: 'samantha.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Samantha_Ruth_Prabhu_at_a_promotional_event_%28cropped%29.jpg/800px-Samantha_Ruth_Prabhu_at_a_promotional_event_%28cropped%29.jpg' },
  { name: 'mahesh_babu.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mahesh_Babu_in_2019.jpg/800px-Mahesh_Babu_in_2019.jpg' },
  { name: 'rashmika.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Rashmika_Mandanna_in_2022.jpg/800px-Rashmika_Mandanna_in_2022.jpg' },
  { name: 'ram_charan.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b4/Ram_Charan_in_2023.jpg/800px-Ram_Charan_in_2023.jpg' },
  { name: 'jr_ntr.jpg', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/N.T.Rama_Rao_Jr._in_2022.jpg/800px-N.T.Rama_Rao_Jr._in_2022.jpg' }
];

const destDir = path.join(__dirname, '../public/assets/celebs');

async function downloadImage(url, dest) {
  const response = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)" } });
  if (!response.ok) throw new Error(`unexpected response ${response.statusText}`);
  const arrayBuffer = await response.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(arrayBuffer));
}

async function main() {
  for (const celeb of celebs) {
      const dest = path.join(destDir, celeb.name);
      try {
          await downloadImage(celeb.url, dest);
          console.log(`Success: ${celeb.name}`);
      } catch (err) {
          console.error(`Error downloading ${celeb.name}:`, err);
      }
  }
}

main();

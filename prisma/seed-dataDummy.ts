import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
    const css = await prisma.prog_languages.upsert({
        where: { id: "css" },
        update: {},
        create: {
            id: "css",
            name: "CSS Programming",
            description: 
                "Cascading Style Sheet (CSS) merupakan aturan untuk mengatur beberapa komponen dalam sebuah web sehingga akan lebih terstruktur dan seragam. CSS bukan merupakan bahasa pemograman.CSS dapat mengendalikan ukuran gambar, warna bagian tubuh pada teks, warna tabel, ukuran border, warna border, warna hyperlink, warna mouse over, spasi antar paragraf, spasi antar teks, margin kiri, kanan, atas, bawah, dan parameter lainnya. CSS adalah bahasa style sheet yang digunakan untuk mengatur tampilan dokumen. Dengan adanya CSS memungkinkan kita untuk menampilkan halaman yang sama dengan format yang berbeda.",
            thumbnail_url: "/images/css-logo.png",
        },
    });

    const module1 = await prisma.modules.create({
        data: {
            overview: "A basic module of CSS",
            title: "CSS Basic",
            prog_languages_id: css.id,
            order: 1,
        },
    });

    await prisma.submodules.create({
        data: {
            title: "Sejarah CSS",
            module_id: module1.id,
            contents: `

Nama CSS didapat dari fakta bahwa setiap deklarasi style yang berbeda dapat diletakkan secara berurutan, yang kemudian membentuk hubungan (parent-child) pada setiap style. CSS sendiri merupakan sebuah teknologi internet yang direkomendasikan oleh World Wide Web Consortium atau W3C pada tahun 1996. Setelah CSS distandardisasikan, Internet Explorer dan Netscape melepas browser terbaru mereka yang telah sesuai atau paling tidak hampir mendekati dengan standar CSS.

Untuk saat ini terdapat tiga versi CSS, yaitu CSS1, CSS2, dan CSS3. CSS1 dikembangkan berpusat pada pemformatan dokumen HTML, CSS2 dikembangkan untuk memenuhi kebutuhan terhadap format dokumen agar bisa ditampilkan di printer, sedangkan CSS3 adalah versi terbaru dari CSS yang mampu melakukan banyak hal dalam desain website. CSS3 mendukung penentuan posisi konten, downloadable, huruf font, tampilan pada tabel /table layout dan media tipe untuk printer. Kehadiran versi CSS yang ketiga diharapkan lebih baik dari versi pertama dan kedua.

CSS3 juga dapat melakukan animasi pada halaman website, di antaranya animasi warna hingga animasi 3D. Dengan CSS3 desainer lebih dimudahkan dalam hal kompatibilitas websitenya pada smartphone dengan dukungan fitur baru yakni media query. Selain itu, banyak fitur baru pada CSS3 seperti: multiple background, border-radius, drop-shadow, border-image, CSS Math, dan CSS Object Model.

`,
            is_exercise: false,
            order: 1,
        },
    });

    await prisma.submodules.create({
        data: {
            title: "Apa itu CSS",
            module_id: module1.id,
            contents: `

Cascading Style Sheets (CSS) adalah mekanisme sederhana untuk menambahkan gaya 
            
(misalnya, font, warna, spasi, posisi, dll) pada halaman Web.

`,
            is_exercise: false,
            order: 2,
        },
    });

    await prisma.submodules.create({
        data: {
          title: "Sintaksis CSS 1",
          module_id: module1.id,
          contents: `

Skrip CSS dapat ditempatkan di mana saja dalam dokumen.

Skrip CSS diawali dengan tag <style> dan diakhiri dengan tag </style>

~~~
<style>
// Skrip kode CSS
</style>
~~~

Ekstensi file default untuk file CSS adalah ".css".

Script CSS biasanya berisi tag HTML, dan beberapa kode skrip CSS.

Pernyataan CSS diakhiri dengan titik koma (;).

Di bawah ini adalah contoh file CSS sederhana:

~~~css
<!DOCTYPE html>
<html>
<head>
<style>
p {
  color: green;
  text-align: center;
} 
</style>
</head>
<body>

<p>Hello World!</p>
<p>These paragraphs are styled with CSS.</p>

</body>
</html>
~~~

Untuk memberikan style pada tampilan website, kita juga bisa memberi id maupun class pada kode html.

Untuk memanggil id pada style css menggunakan sintaks pagar (#), sedangkan class bisa dipanggil dengan sintaks tanda titik (.).

~~~css
<!DOCTYPE html>
<html>
<head>
<style>
p {
  color: blue;
} 

#teks {
  color: grey;
}

.teks2 {
  color: red;
}
</style>
</head>
<body>

<p>Every paragraph will be affected by the style.</p>
<p id="teks">Me too!</p>
<p class="teks2">And me!</p>

</body>
</html>
~~~

`,
          is_exercise: false,
          order: 3,
        },
    });

    const exercise1 = await prisma.submodules.create({
      data: {
        title: "Sintaksis CSS",
        module_id: module1.id,
        contents: `
    
Pelajari dan pahami materi sebelumnya untuk dapat mengerjakan percobaan ini.

Lakukan percobaan dengan mengimplementasikan sintaks sesuai ‘extpected output’ dibawah ini.

Buat sintaks CSS seperti percobaan sebelumnya, lalu tambahkan tag <p> dan berisi id "paragraf", salanjutnya ubah tampilan teks tersebut menjadi berwarna hitam dengan menggunakan sintaks (#).

`,
        is_exercise: true,
        order: 4,
      },
    });
    
    await prisma.submodule_exercises.create({
        data: {
          submodule_id: exercise1.id,
          expected_output: "Halo! Saya kuliah di PENS",
          expected_code: `["style", "#", "black", "Halo! Saya kuliah di PENS"]`,
          placeholder: "// type here",
        },
    });

    const exercise2 = await prisma.submodules.create({
      data: {
        title: "Sintaksis CSS (1)",
        module_id: module1.id,
        contents: `
    
Pelajari dan pahami materi sebelumnya untuk dapat mengerjakan percobaan ini.

Lakukan percobaan dengan mengimplementasikan sintaks sesuai ‘extpected output’ dibawah ini.

Buat sintaks CSS seperti percobaan sebelumnya, lalu tambahkan tag <h1> dan berisi class "head", salanjutnya ubah tampilan teks tersebut menjadi berwarna hijau (green) dengan menggunakan sintaks (.).

Yang dimana sintaks (.) adalah cara pemanggilan css untuk atribut class.

`,
        is_exercise: true,
        order: 5,
      },
    });
    
    await prisma.submodule_exercises.create({
        data: {
          submodule_id: exercise2.id,
          expected_output: "Thanks Everyone",
          expected_code: `["style", ".", "head", "class", "green", "Thanks Everyone"]`,
          placeholder: "// type here",
        },
    });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
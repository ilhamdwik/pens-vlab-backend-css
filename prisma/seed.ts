import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const php = await prisma.prog_languages.upsert({
    where: { id: "php" },
    update: {},
    create: {
      id: "php",
      name: "PHP Programming",
      description:
        "PHP atau Hypertext Preprocessor adalah bahasa pemrograman yang berjalan pada server side scripting dan bersifat open source (sumber terbuka). PHP sering digunakan untuk pembuatan aplikasi berbasis website yang berjalan secara dinamis, sehingga dapat terintegrasi dengan basis data (database).",
      thumbnail_url: "/images/php-logo-thumbnail.png",
    },
  });

  const module1 = await prisma.modules.create({
    data: {
      overview: "A basic module of PHP Language",
      title: "PHP Basic",
      prog_languages_id: php.id,
      order: 1,
    },
  });

  const module2 = await prisma.modules.create({
    data: {
      overview: "An intermediate module of PHP Language",
      title: "PHP Intermediate",
      prog_languages_id: php.id,
      order: 2,
    },
  });

  const module3 = await prisma.modules.create({
    data: {
      overview: "An advanced module of PHP Language",
      title: "PHP Advanced",
      prog_languages_id: php.id,
      order: 3,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Sejarah PHP",
      module_id: module1.id,
      contents: `
Pada awalnya PHP merupakan kependekan dari Personal Home Page (Situs personal). PHP pertama kali dibuat oleh Rasmus Lerdorf pada tahun 1995. Pada waktu itu PHP masih bernama Form Interpreted (FI), yang wujudnya berupa sekumpulan skrip yang digunakan untuk mengolah data formulir dari web.

Selanjutnya Rasmus merilis kode sumber tersebut untuk umum dan menamakannya PHP/FI. Dengan perilisan kode sumber ini menjadi sumber terbuka, maka banyak pemrogram yang tertarik untuk ikut mengembangkan PHP.

Pada November 1997, dirilis PHP/FI 2.0. Pada rilis ini, interpreter PHP sudah diimplementasikan dalam program C. Dalam rilis ini disertakan juga modul-modul ekstensi yang meningkatkan kemampuan PHP/FI secara signifikan.

Pada tahun 1997, sebuah perusahaan bernama Zend menulis ulang interpreter PHP menjadi lebih bersih, lebih baik, dan lebih cepat. Kemudian pada Juni 1998, perusahaan tersebut merilis interpreter baru untuk PHP dan meresmikan rilis tersebut sebagai PHP 3.0 dan singkatan PHP diubah menjadi akronim berulang PHP: Hypertext Preprocessor.

Pada pertengahan tahun 1999, Zend merilis interpreter PHP baru dan rilis tersebut dikenal dengan PHP 4.0. PHP 4.0 adalah versi PHP yang paling banyak dipakai pada awal abad ke-21. Versi ini banyak dipakai disebabkan kemampuannya untuk membangun aplikasi web kompleks tetapi tetap memiliki kecepatan dan stabilitas yang tinggi.

Pada Juni 2004, Zend merilis PHP 5.0. Dalam versi ini, inti dari interpreter PHP mengalami perubahan besar. Versi ini juga memasukkan model pemrograman berorientasi objek ke dalam PHP untuk menjawab perkembangan bahasa pemrograman ke arah paradigma berorientasi objek. Peladen web bawaan ditambahkan pada versi 5.4 untuk mempermudah pengembang menjalankan kode PHP tanpa menginstal peladen perangkat lunak.

Versi terbaru dan stabil dari bahasa pemograman PHP saat ini adalah versi 8.0.

`,
      is_exercise: false,
      order: 1,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Install PHP",
      module_id: module1.id,
      contents: `

Lakukan langkah berikut untuk memulai menggunakan PHP :

- Temukan host web yang mendukung bahasa pemrograman PHP dan MySQL
- Instal server web di PC, lalu instal PHP dan MySQL

PENS VLAB menyediakan fitur ‘Playground’ berupa online compiler agar anda dapat bereksperimen dengan kode PHP dan memperoleh output pada halam browser anda.

Jalankan potongan kode program dibawah untuk mengetahui outputnnya.
~~~php
<?php
echo "Yuk Belajar PHP";
?>
~~~

`,
      is_exercise: false,
      order: 2,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Sintaksis PHP (1)",
      module_id: module1.id,
      contents: `
Skrip PHP dapat ditempatkan di mana saja dalam dokumen.

Skrip PHP diawali dengan tag <?php dan diakhiri dengan tag ?>

~~~
<?php
// Skrip kode PHP
?>
~~~

Ekstensi file default untuk file PHP adalah ".php".

File PHP biasanya berisi tag HTML, dan beberapa kode skrip PHP.

Pernyataan PHP diakhiri dengan titik koma (;).

Di bawah ini adalah contoh file PHP sederhana, dengan skrip PHP yang menggunakan fungsi bawaan PHP "echo" untuk menampilkan teks "Halo Dunia" di halaman web:

~~~php
<!DOCTYPE html>
<html>
<body>

<h1>Ini Heading</h1>

<?php
echo "Halaman Dunia!";
?>

</body>
</html>
~~~

PHP bersifat not case-sensitive atau tidak peka terhadap huruf besar-kecil pada beberapa kata kunci (if, else, while, echo, etc, dll.).

Seperti contoh di bawah ini , terdapat 3 sintaks echo dengan penulisan berbeda :

~~~php
<!DOCTYPE html>
<html>
<body>

<?php
ECHO "Halo Dunia<br>";
echo " Halo Dunia <br>";
EcHo " Halo Dunia<br>";
?>

</body>
</html>
~~~

Berbeda pada penamaan variabel. PHP bersifat case-sensitive atau peka terhadap huruf  besar-kecil untuk penamaan variabel.

Seperti contoh dibawah ini, hanya pernyataan pertama yang akan menampilkan nilai variabel $warna. Dikarenakan variabel $warna, $WARNA, dan $warNA adalah tiga variabel berbeda :

~~~php
<!DOCTYPE html>
<html>
<body>

<?php
$warna = "merah";
echo "Baju saya berwarna " . $warna . "<br>";
echo "Buku saya berwarna " . $ WARNA. "<br>";
echo " Mobil saya berwarna " . $ warNA. "<br>";
?>

</body>
</html>
~~~

`,
      is_exercise: false,
      order: 3,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Sintaksis PHP (2)",
      module_id: module1.id,
      contents: `
Terdapat  dua cara dasar pada PHP untuk mendapatkan output yaitu menggunakan perintah echo dan print.

Fungsi echo dan print kurang lebih sama. Keduanya sama-sama digunakan untuk menampilkan data ke layar.

Perbedaannya kecilnya antara lain : 
- Echo tidak memiliki nilai kembalian sedangkan print memiliki nilai kembalian 1 sehingga dapat digunakan dalam ekspresi. 
- Echo dapat mengambil beberapa parameter (walaupun penggunaan seperti itu jarang terjadi) sementara print dapat mengambil satu argumen. 
-Cara kerja echo sedikit lebih cepat daripada print.

Pernyataan echo dapat digunakan dengan atau tanpa tanda kurung, yaitu echo atau echo().

Berikut cara menampilkan teks dengan perintah echo (perhatikan bahwa teks dapat berisi markup HTML):

~~~php
<?php
echo "<h2>Belajar PHP di PENS VLab</h2>";
echo "Halo Dunia<br>";
echo "Saya ", "sedang ", "belajar ", "pemrograman ", "PHP.";
?>
~~~

Berikut menunjukkan cara bagaimana menampilkan teks dan variabel dengan pernyataan echo :

~~~php
<?php
$txt1 = "Belajar PHP";
$txt2 = "PENS VLab";
$x = 2;
$y = 3;

echo "<h2>" . $txt1 . "</h2>";
echo "Belajar permrograman PHP di  " . $txt2 . "<br>";
echo $x + $y;
?>
~~~

Pernyataan print dapat digunakan dengan atau tanpa tanda kurung: print atau print().

Berikut cara menampilkan teks dengan perintah print (perhatikan bahwa teks dapat berisi markup HTML) :

~~~php
<?php
print "<h2>Belajar PHP di PENS VLab</h2>";
print "Halo Dunia<br>";
print "Saya sedang  belajar pemrograman PHP.";
?>
~~~

Berikut cara menampilkan teks dan variabel dengan perintah print :

~~~php
<?php
$txt1 = "Belajar PHP";
$txt2 = "PENS VLab";
$x = 2;
$y = 3;

print "<h2>" . $txt1 . "</h2>";
print "Belajar permrograman PHP di  " . $txt2 . "<br>";
echo $x + $y;
?>
~~~

`,
      is_exercise: false,
      order: 4,
    },
  });

  const exercise1 = await prisma.submodules.create({
    data: {
      title: "Sintaksis PHP",
      module_id: module1.id,
      contents: `

Pelajari dan pahami materi sebelumnya untuk dapat mengerjakan percobaan ini.

Lakukan percobaan dengan mengimplementasikan sintaks dasar dan variabel sesuai ‘extpected output’ dibawah ini.

Pastikan terdapat deklarasi variabel $institusi yang berisi nilai PENS.

`,
      is_exercise: true,
      order: 5,
    },
  });

  await prisma.submodule_exercises.create({
    data: {
      submodule_id: exercise1.id,
      expected_output: "Halo! Saya kuliah di PENS",
      expected_code: `["php", "echo", "$institusi"]`,
      placeholder: "// type here",
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Komentar PHP",
      module_id: module1.id,
      contents: `
Komentar dalam PHP adalah baris yang tidak dieksekusi sebagai bagian dari program. Komentar bertujuan untuk memudahkan programmer untuk meniggalkan catatan mengenai kodenya.

Untuk menampilkan komentar pada PHP, anda perlu menuliskan karakter // atau /*.

Berikut ini adalah beberapa contoh cara penggunaan komentar pada PHP.

Sintaks untuk komentar satu baris :

~~~php
!DOCTYPE html>
<html>
<body>

<?php
// Ini komentar satu baris

# Ini juga komentar satu baris
?>

</body>
</html>
~~~

Sintaks untuk komentar beberapa baris :

~~~php
<!DOCTYPE html>
<html>
<body>

<?php
/*
Ini adalah blok komentar beberapa baris
*/
?>

</body>
</html>
~~~

Menggunakan komentar untuk menghilangkan bagian dari kode :

~~~php
<!DOCTYPE html>
<html>
<body>

<?php
$x = 5 /* + 15 */ + 5;
echo $x;
?>

</body>
</html>
~~~

`,
      is_exercise: false,
      order: 6,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Variabel PHP",
      module_id: module1.id,
      contents: `
Dalam PHP, sebuah variabel dimulai dengan tanda $, lalu diikuti dengan nama variabel. Seperti yang telah dijelaskan sebelumnya, penulisan nama variabel bersifat case-sensitive atau penggunaan dari huruf kapital dan kecil akan sangat berpengaruh pada output yang dihasilkan.

Saat menetapkan nilai teks kedalam variabel, beri tanda kutip diantara nilai.

~~~
<?php
$x = 5;
$y = 10.5;
?>
~~~

Sebuah variabel dapat memiliki nama pendek (seperti x dan y) atau nama yang lebih deskriptif (umur, carname, total_volume).

Aturan untuk variabel PHP:
- Sebuah variabel dimulai dengan tanda $, diikuti dengan nama variabel
- Nama variabel harus dimulai dengan huruf atau karakter garis bawah
- Nama variabel tidak boleh dimulai dengan angka
- Nama variabel hanya boleh berisi karakter alfanumerik dan garis bawah (A-z, 0-9, dan _ )
- Nama variabel peka terhadap huruf besar-kecil ($var dan $VAR adalah dua variabel yang berbeda)

Contoh berikut akan menunjukkan cara menampilkan teks dan variabel :

~~~php
<?php
$txt = "PENS VLab";
echo "Belajar PHP di $txt!";
?>
~~~

Contoh berikut akan menghasilkan output yang sama seperti contoh di atas :

~~~php
<?php
$txt = "PENS VLab";
echo "Belajar PHP di " . $txt . "!";
?>
~~~

Contoh berikut akan menampilkan jumlah dari dua variabel :

~~~php
<?php
$x = 5;
$y = 4;
$z = $x + $y;
echo $x + $y;
echo $z;
?>
~~~

`,
      is_exercise: false,
      order: 7,
    },
  });

  const exercise2 = await prisma.submodules.create({
    data: {
      title: "Variabel PHP",
      module_id: module1.id,
      contents: `
Pelajari dan pahami materi sebelumnya untuk dapat mengerjakan percobaan ini.

Lakukan percobaan dengan mengimplementasikan variabel sesuai ‘extpected output’ dibawah ini.

Deklarasikan variabel berikut :
- $bilangan_1 yang bernilai 8.
- $bilangan_2 yang bernilai 9.
- $hasil_penjumlahan yang menampung hasil penjumlahan 2 variabel diatas.

`,
      is_exercise: true,
      order: 8,
    },
  });

  await prisma.submodule_exercises.create({
    data: {
      submodule_id: exercise2.id,
      expected_output: "Hasil penjumlahan 8 + 9 adalah 17",
      expected_code: `["php", "echo", "$bilangan_1", "$bilangan_2", "$hasil_penjumlahan"]`,
      placeholder: "// type here",
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Tipe Data PHP (1)",
      module_id: module1.id,
      contents: `
Variabel dapat menyimpan data dari tipe yang berbeda, dan dari tipe data yang berbeda juga dapat melakukan hal yang berbeda.

PHP mendukung tipe data berikut :      
- String
- Integer
- Float (floating point numbers - also called double)
- Boolean
- Array
- Object
- NULL
- Resource

## PHP String
String adalah urutan karakter, seperti "Halo Dunia".

String dapat berupa teks apa pun yang berada dalam tanda kutip. Tanda kutip yang digunakan dapat tanda kutip tunggal atau ganda.

~~~php
<?php
$x = " Halo Dunia ";
$y = ' Halo Dunia ';

echo $x;
echo "<br>";
echo $y;
?>
~~~

## PHP Integer
Tipe data integer adalah angka non-desimal antara -2.147.483.648 dan 2.147.483.647.

Adapun berikut aturan tipe data integer :
- Sebuah bilangan bulat harus memiliki setidaknya satu digit
- Bilangan bulat tidak boleh memiliki titik desimal
- Bilangan bulat bisa positif atau negatif
- Bilangan bulat dapat ditentukan dalam: desimal (basis 10), heksadesimal (basis 16), oktal (basis 8), atau biner (basis 2) notasi

Berikut contoh variabel $x yang bertipe integer. Fungsi PHP var_dump() mengembalikan tipe dan nilai data :

~~~php
<?php
$x = 1234;
var_dump($x);
?>
~~~

## Float PHP
Float adalah bilangan dengan titik desimal atau bilangan dalam bentuk eksponensial.

Dalam contoh berikut $x bertipe float. Fungsi PHP var_dump() mengembalikan tipe dan nilai data :

~~~php
<?php
$x = 9.999;
var_dump($x);
?>
~~~

## Boolean PHP
Boolean mewakili dua kemungkinan status: TRUE atau FALSE.

~~~
$x = true;
$y = false;
~~~

## Array PHP
Array menyimpan kumpulan beberapa nilai dalam satu variabel tunggal.

Dalam contoh berikut $warna_primer adalah sebuah array. Fungsi PHP var_dump() mengembalikan tipe dan nilai data :

~~~php
<?php
$warna_primer = array("Merah","Kuning","Biru");
var_dump($warna_primer);
?>
~~~

`,
      is_exercise: false,
      order: 9,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Tipe Data PHP (1)",
      module_id: module1.id,
      contents: `
## Objek PHP
Kelas dan objek adalah dua aspek utama dari pemrograman berorientasi objek.

Kelas adalah template untuk objek, dan objek adalah turunan dari kelas.

Ketika objek dibuat, mereka mewarisi semua properti dan perilaku dari kelas, tetapi setiap objek akan memiliki nilai yang berbeda untuk properti.

Misal terdapat kelas bernama Mobil. Mobil dapat memiliki properti seperti model, warna, dll. Kita dapat mendefinisikan variabel seperti $model, $color, dan seterusnya, untuk menyimpan nilai properti ini.

Ketika objek individu (Volvo, BMW, Toyota, dll.) dibuat, mereka mewarisi semua properti dan perilaku dari kelas, tetapi setiap objek akan memiliki nilai properti yang berbeda.

Dengan menggunakan fungsi __construct(), PHP akan secara otomatis memanggil fungsi ini saat Anda membuat objek dari kelas.

~~~php
<?php
class Car {
  public $color;
  public $model;
  public function __construct($color, $model) {
    $this->color = $color;
    $this->model = $model;
  }
  public function message() {
    return "My car is a " . $this->color . " " . $this->model . "!";
  }
}

$myCar = new Car("black", "Volvo");
echo $myCar -> message();
echo "<br>";
$myCar = new Car("red", "Toyota");
echo $myCar -> message();
?>
~~~

## Nilai PHP NULL
Null adalah tipe data khusus yang hanya dapat memiliki satu nilai yaitu NULL.

Variabel tipe data NULL adalah variabel yang tidak memiliki nilai yang ditetapkan untuk itu.

Jika variabel dibuat tanpa nilai, maka secara otomatis diberi nilai NULL.

Variabel juga dapat dikosongkan dengan mengatur nilai ke NULL :

~~~php
<?php
$x = "Hello world!";
$x = null;
var_dump($x);
?>
~~~

## PHP Resource
Tipe data resoource bukanlah tipe data yang sebenarnya. Ini adalah penyimpanan referensi ke fungsi dan resource di luar PHP.

Contoh umum menggunakan tipe data sumber daya adalah panggilan database.
  
`,
      is_exercise: false,
      order: 10,
    },
  });

  await prisma.submodules.create({
    data: {
      title: "Operator PHP",
      module_id: module2.id,
      contents: `
Operator digunakan untuk melakukan operasi pada variabel dan nilai.

PHP membagi operator dalam kelompok berikut:
- Operator aritmatika
- Operator penugasan
- Operator perbandingan
- Operator Kenaikan/Penurunan
- Operator logika
- Operator string
- Operator array
- Operator kondisi

## Operator Aritmatika
Operator aritmatika PHP digunakan dengan nilai numerik untuk melakukan operasi aritmatika umum, seperti penambahan, pengurangan, perkalian, dll.

`,
      is_exercise: false,
      order: 1,
    },
  });

  // user related
  const roleAdmin = await prisma.roles.create({
    data: {
      id: "adm",
      role_name: "admin",
    },
  });

  const userAdmin = await prisma.users.create({
    data: {
      email: "sherlymaya@pens.ac.id",
    },
  });

  await prisma.user_to_role.create({
    data: {
      user_id: userAdmin.id,
      role_id: roleAdmin.id,
    },
  });

  const hash2 = await bcrypt.hash("sherlycantik", 12);

  await prisma.admins.create({
    data: {
      name: "Sherly Maya",
      pswd: hash2,
      user_id: userAdmin.id,
    },
  });

  await prisma.roles.createMany({
    data: [
      {
        id: "stu",
        role_name: "student",
      },
      {
        id: "lec",
        role_name: "lecturer",
      },
    ],
  });

  await prisma.classes.createMany({
    data: [
      {
        kelas: "1",
        program: "D4",
        jurusan: "Teknik Informatika",
      },
      {
        kelas: "2",
        program: "D4",
        jurusan: "Teknik Informatika",
      },
      {
        kelas: "3",
        program: "D4",
        jurusan: "Teknik Informatika",
      },
      {
        kelas: "4",
        program: "D4",
        jurusan: "Teknik Informatika",
      },
      {
        kelas: "1",
        program: "D3",
        jurusan: "Teknik Informatika",
      },
      {
        kelas: "2",
        program: "D3",
        jurusan: "Teknik Informatika",
      },
      {
        kelas: "3",
        program: "D3",
        jurusan: "Teknik Informatika",
      },
    ],
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

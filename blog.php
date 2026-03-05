<?php ?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog - Yogi Ilham</title>

<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" rel="stylesheet">

<style>
body{
  margin:0;
  font-family:'Montserrat',sans-serif;
  background:#f3f3f3;
  color:#111;
  overflow-x:hidden;
}

/* ambient */
body::before{
  content:"";
  position:fixed;
  inset:-30%;
  background:
    radial-gradient(circle at 20% 20%, rgba(255,170,60,.18), transparent 50%),
    radial-gradient(circle at 80% 30%, rgba(255,60,60,.15), transparent 50%),
    radial-gradient(circle at 60% 80%, rgba(80,200,200,.15), transparent 50%);
  filter:blur(120px);
  z-index:-1;
}

.container{
  max-width:1100px;
  margin:auto;
  padding:0 40px;
}

/* header */
header{
  height:72px;
  display:flex;
  align-items:center;
  justify-content:space-between;
}
.brand{display:flex;align-items:center;gap:12px;font-weight:600}
.dot{width:18px;height:18px;border-radius:50%;background:#f5a623}
nav{display:flex;gap:16px;font-size:14px;align-items:center}
nav a{text-decoration:none;color:#111;display:inline-block;padding:6px 12px;position:relative;transition:color .18s ease, transform .12s ease}
nav a:hover{transform:translateY(-2px);color:#111}

/* active nav link for current page */
nav{display:flex;gap:16px;font-size:14px;align-items:center}
nav a{text-decoration:none;color:#111;display:inline-block;padding:6px 12px;position:relative;transition:color .18s ease, transform .12s ease}
nav a:hover{transform:translateY(-2px)}

/* active nav link */
nav a.active{color:#f5a623;font-weight:700}
nav a.active::after{content:"";position:absolute;left:0;right:0;bottom:0;height:4px;background:#f5a623;border-radius:3px;transform:translateY(6px)}

/* title */
.page-title{
  font-size:56px;
  font-weight:800;
  margin:80px 0 40px;
}

/* featured */
.featured{
  display:grid;
  grid-template-columns:1.2fr 1fr;
  gap:40px;
  margin-bottom:60px;
  align-items:center;
}

.featured img{
  width:100%;
  border-radius:18px;
  box-shadow:0 30px 80px rgba(0,0,0,.18);
}

.featured-title{
  font-size:28px;
  font-weight:700;
  margin-bottom:10px;
}

.featured-desc{
  color:#555;
  margin-bottom:14px;
}

.tag{
  display:inline-block;
  background:#eee;
  padding:4px 10px;
  border-radius:6px;
  font-size:12px;
  margin-right:6px;
}

/* grid */
.posts{
  display:grid;
  grid-template-columns:repeat(3,1fr);
  gap:26px;
}

/* card */
.card{
  background:#fff;
  border-radius:16px;
  overflow:hidden;
  box-shadow:0 16px 40px rgba(0,0,0,.08);
  transition:.3s;
}
.card:hover{
  transform:translateY(-6px);
}

.card img{
  width:100%;
  height:160px;
  object-fit:cover;
}

.card-body{
  padding:16px 18px 20px;
}

.card-title{
  font-weight:600;
  margin-bottom:6px;
}

.card-desc{
  font-size:14px;
  color:#555;
  margin-bottom:10px;
}

/* footer */
footer{
  border-top:1px solid #ddd;
  margin-top:80px;
  padding:30px 0;
  display:flex;
  justify-content:space-between;
  align-items:center;
  gap:24px;
  font-size:13px;
}

.social{
  display:flex;
  flex-direction:column;
  align-items:flex-start;
}

.social .social-links{display:flex;gap:12px;margin-top:8px}

.social i{margin-right:0}

/* remove underline from social links (icons) */
.social a{text-decoration:none;color:inherit;display:inline-flex;align-items:center}

/* mobile */
@media(max-width:900px){
.container{padding:0 24px}
.posts{grid-template-columns:1fr}
.featured{grid-template-columns:1fr}
.page-title{font-size:40px}
 footer{flex-direction:column;align-items:flex-start;gap:12px}
}
</style>
</head>

<body>

<div class="container">

<header>
<div class="brand"><div class="dot"></div>Yogi Ilham</div>
<nav>
<a href="index.php">Home</a>
<a href="resume.php">Resume</a>
<a href="projects.php">Projects</a>
<a href="contact.php">Contact</a>
<a href="blog.php" class="active">Blog</a>
   
</nav>
</header>

<div class="page-title">Blog</div>

<!-- FEATURED -->
<div class="featured">
<img src="blog1.jpg">

<div>
<div class="featured-title">YOLO for Wildlife Detection</div>
<div class="featured-desc">
How YOLO models enable automated detection of humans and animals in UAV thermal imagery.
</div>

<div>
<span class="tag">AI</span>
<span class="tag">Computer Vision</span>
<span class="tag">YOLO</span>
</div>
</div>
</div>


<footer>
  <div>
    Email<br>
    yogiilham003@gmail.com
  </div>

  <div class="social">
    Follow Me
    <div class="social-links">
      <a href="https://www.linkedin.com/in/ahmad-yogi/" target="_blank"><i class="fab fa-linkedin"></i></a>
      <a href="https://github.com/AhmadYogiKulumulilham1855201067" target="_blank"><i class="fab fa-github"></i></a>
      <a href="https://instagram.com/yogi_ilham02" target="_blank"><i class="fab fa-instagram"></i></a>
    </div>
  </div>

  <div>© 2026 Yogi Ilham</div>

</footer>

</div>

</body>
</html>

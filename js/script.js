/* ======================================
🐾 DOM’S PET - JAVASCRIPT FINAL COMPLETO
====================================== */

// 🔹 Simples sistema SPA (Single Page Application)
document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll("nav a");
  const pages = ["index.html", "projetos.html", "cadastro.html"];

  // Marca o link ativo
  const current = window.location.pathname.split("/").pop();
  links.forEach(link => {
    if (link.getAttribute("href") === current) {
      link.classList.add("ativo");
    }
  });

  // Evita reload desnecessário (simulação SPA)
  links.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href");
      if (pages.includes(href)) {
        e.preventDefault();
        window.location.href = href;
      }
    });
  });
});

// ======================================
// 🟢 Sistema de verificação de formulário
// ======================================
const form = document.querySelector("#cadastroForm");

if (form) {
  form.addEventListener("submit", e => {
    e.preventDefault();

    const campos = form.querySelectorAll("input[required]");
    let valido = true;

    campos.forEach(campo => {
      if (!campo.value.trim()) {
        valido = false;
        campo.classList.add("erro");
      } else {
        campo.classList.remove("erro");
      }
    });

    if (!valido) {
      mostrarToast("⚠️ Por favor, preencha todos os campos obrigatórios!");
      return;
    }

    // Verificação simples de CPF e E-mail
    const cpf = document.querySelector("#cpf").value;
    const email = document.querySelector("#email").value;

    if (!validarCPF(cpf)) {
      mostrarToast("❌ CPF inválido!");
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      mostrarToast("❌ E-mail inválido!");
      return;
    }

    mostrarToast("✅ Cadastro enviado com sucesso!");
    form.reset();
  });
}

// ===============================
// 🟡 Funções auxiliares
// ===============================
function mostrarToast(mensagem) {
  let toast = document.createElement("div");
  toast.textContent = mensagem;
  toast.className = "toast";
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("mostrar");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("mostrar");
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}

function validarCPF(cpf) {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cpf[i]) * (10 - i);
  let resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cpf[i]) * (11 - i);
  resto = 11 - (soma % 11);
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
}

// ===============================
// 🔹 Máscaras de input dinâmicas
// ===============================
const masks = {
  cpf: value => value
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2"),
  telefone: value => value
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d{4})$/, "$1-$2"),
  cep: value => value
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d)/, "$1-$2"),
};

document.querySelectorAll("input").forEach(input => {
  input.addEventListener("input", e => {
    const tipo = e.target.id;
    if (masks[tipo]) {
      e.target.value = masks[tipo](e.target.value);
    }
  });
});

// ===============================
// 🍔 MENU HAMBÚRGUER RESPONSIVO (com acessibilidade)
// ===============================
(function () {
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("siteNav");

  if (!menuToggle || !nav) return;

  // Alterna o menu
  function toggleMenu() {
    const isOpen = nav.classList.toggle("mostrar");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✖" : "☰";
  }

  menuToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Fecha quando clique em um link do menu
  nav.addEventListener("click", (e) => {
    const alvo = e.target;
    if (alvo.tagName === "A") {
      nav.classList.remove("mostrar");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }
  });

  // Fecha se clicar fora do nav (mobile)
  document.addEventListener("click", (e) => {
    if (!nav.classList.contains("mostrar")) return;
    // se o clique não estiver dentro do nav nem no botão
    if (!nav.contains(e.target) && e.target !== menuToggle) {
      nav.classList.remove("mostrar");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }
  });

  // Fecha com Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mostrar")) {
      nav.classList.remove("mostrar");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }
  });

  // Ajuste: se a janela for redimensionada para desktop, garante que nav fique visível
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      nav.classList.remove("mostrar");
      menuToggle.textContent = "☰";
      menuToggle.setAttribute("aria-expanded", "false");
      // remove inline max-height (se houver)
      nav.style.maxHeight = null;
    }
  });
})();

// ===============================
// 🌙 DARK MODE - Ativação e Salvar Preferência
// ===============================
const toggle = document.getElementById("darkModeToggle");
const body = document.body;

// Carrega o modo salvo
if (localStorage.getItem("darkMode") === "true") {
  body.classList.add("dark-mode");
  toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
  body.classList.toggle("dark-mode");
  const darkAtivo = body.classList.contains("dark-mode");
  toggle.textContent = darkAtivo ? "☀️" : "🌙";
  localStorage.setItem("darkMode", darkAtivo);
});

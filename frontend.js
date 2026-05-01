const global = {
  link: "https://www.coincoele.com.br/Scripts/smiles/?pt-br/Paginas/default.aspx",
};

const url = "https://www.virustotal.com/api/v3/urls/";
async function phishing() {
  const res = await fetch("http://localhost:3000/check", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ link: global.link }),
  });

  if (!res.ok) {
    throw new Error(`POST failed: ${res.status}`);
  }

  const { data } = await res.json();
  console.log(data.id);
  setTimeout(() => {
    test(data.id);
  }, 8000);
  //   console.log(data.id);
  console.log(data);
}

async function test(id) {
  const data2 = await fetch(`http://localhost:3000/result/${id}`);
  if (!data2.ok) {
    throw new Error(`GET failed: ${data2.status}`);
  }
  const res2 = await data2.json();

  console.log(res2);
}

async function reanalyse() {
  const response = await fetch("http://localhost:3000/reanalyse", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ link: global.link }),
  });

  if (!response.ok) {
    throw new Error(`POST failed: ${response.status}`);
  }

  const { data } = await response.json();
  setTimeout(() => {
    getreAnalyse(data.id);
  }, 10000);
}

async function getreAnalyse(id) {
  const data = await fetch(`http://localhost:3000/result/${id}`);
  if (!data.ok) {
    throw new Error(`GET failed: ${data.status}`);
  }
  const res = await data.json();

  console.log(res);
}
reanalyse();
phishing();

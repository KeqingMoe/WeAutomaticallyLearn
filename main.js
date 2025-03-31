const sleep = async ms => new Promise(res => setTimeout(() => res(), ms));
setInterval(async () => {
  const iframe = document.getElementById('contentFrame');
  const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
  if (iframeDocument.querySelector('div[data-controltype="submitinfo"]')?.textContent == '尚未提交。') {
    const results = iframeDocument.querySelectorAll('div[data-itemtype="result"]');
    results.forEach(result => {
      const solution = result.textContent;
      const answer = solution.split("/")[0].replace('(Answers may vary.)', '').replace(/[ \n]+/g, ' ').trim();

      const input = result.closest('div').parentElement.querySelector('input[data-itemtype="input"]');
      if (input) {
        input.value = answer;
      }
      const myResult = result.closest('div').parentElement.querySelector('div[data-itemtype="myresult"]');
      if (myResult) {
        myResult.innerHTML = answer;
      }
      const choiceList = result.closest('div[data-controltype="choice"]');
      if (choiceList) {
        const optionItems = choiceList.querySelectorAll('li[data-solution=""]');

        optionItems.forEach(option => {
          option.setAttribute('data-choiced', '');
        });
      }
      const textarea = result.closest('div').parentElement.querySelector('textarea[data-itemtype="textarea"]');
      if (textarea) {
        textarea.value = answer;
      }
    });
    await sleep(250);
    iframeDocument.querySelector('a[data-controltype="submit"]').dispatchEvent(new Event('click'));
    await sleep(250);
    iframeDocument.querySelector('a.layui-layer-btn0').dispatchEvent(new Event('click'));
  }
  await sleep(250);
  iframeDocument.querySelector('div.nextcmd').dispatchEvent(new Event('click'));
}, 1000); // 1000 可改大，尽量不要改小，最好不要小于 800

    function showSection(id) {
      // 모든 탭 비활성화
      const tabs = document.querySelectorAll('.tab');
      tabs.forEach(tab => tab.classList.remove('active'));

      // 클릭된 탭 활성화
      const clickedTab = Array.from(tabs).find(tab => tab.textContent.includes(
        id === 'tickets' ? '관람권' : id === 'snacks' ? '스낵' : '포토카드'
      ));
      if (clickedTab) clickedTab.classList.add('active');

      // 모든 섹션 숨김
      const sections = document.querySelectorAll('.section');
      sections.forEach(section => section.classList.remove('active'));

      // 해당 섹션만 표시
      const target = document.getElementById(id);
      if (target) target.classList.add('active');
    }

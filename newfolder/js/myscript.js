jQuery(document).ready(function ($) {
  // Swiper가 로드되어 있고 타겟이 있을 때만 초기화 (중복 초기화 방지)
  const $visual = $(".visual_swiper");
  let visual_swiper = null;

  if (typeof Swiper !== "undefined" && $visual.length) {
    // Swiper가 이미 초기화 되어 있으면 재초기화 방지
    if ($visual.hasClass("swiper-initialized")) {
      visual_swiper = $visual[0].swiper || null;
    } else {
      // Swiper 인스턴스 생성
      visual_swiper = new Swiper(".visual_swiper", {
        direction: "horizontal",
        loop: true,
        centeredSlides: true,
        slidesPerView: "auto",
        autoplay: { delay: 2500, disableOnInteraction: false },
        pagination: { el: ".swiper-pagination", type: "progressbar" },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },

        // 성능 최적화 옵션
        observer: true,
        observeParents: true,
        watchOverflow: true,
        preloadImages: false,
        lazy: { loadPrevNext: true, loadPrevNextAmount: 1 },
        speed: 600,
        watchSlidesProgress: true,

        // 커스텀 fraction 업데이트 이벤트
        on: {
          init: function () {
            updateFraction(this);
          },
          slideChange: function () {
            updateFraction(this);
          },
        },
      });
    } // if-else

  // 커스텀 fraction 업데이트 함수
    function updateFraction(swiper) {
      // loop 옵션이 true일 때만 loopedSlides를 고려
      if (swiper.params.loop) {
        const current = swiper.realIndex + 1;
        const total = swiper.slides.length - (swiper.loopedSlides * 2);
        $(".custom-fraction .current").text(current);
        $(".custom-fraction .total").text(total);
      } else {
        // loop가 false일 때는 단순히 activeIndex + 1과 전체 슬라이드 수
        const current = swiper.activeIndex + 1;
        const total = swiper.slides.length;
        $(".custom-fraction .current").text(current);
        $(".custom-fraction .total").text(total);
      }
    }

    // 재생/일시정지 버튼 기능 (요소 유무 체크)
    const $autoplayToggleBtn = $("#btn-autoplay-toggle");
    const $playIcon = $("#icon-play");
    const $pauseIcon = $("#icon-pause");
    let isPlaying = true;

    if ($autoplayToggleBtn.length && visual_swiper) {
      $autoplayToggleBtn.on("click", function () {
        if (isPlaying) {
          if (
            visual_swiper.autoplay &&
            typeof visual_swiper.autoplay.stop === "function"
          )
            visual_swiper.autoplay.stop();
          $playIcon.removeClass("hidden");
          $pauseIcon.addClass("hidden");
        } else {
          if (
            visual_swiper.autoplay &&
            typeof visual_swiper.autoplay.start === "function"
          )
            visual_swiper.autoplay.start();
          $playIcon.addClass("hidden");
          $pauseIcon.removeClass("hidden");
        }
        isPlaying = !isPlaying;
      });
    }
  }

  // 다른 페이지/공통 스크립트는 여기 아래에 계속 작성
  // 예: if ($('.product-list').length) { ... }
});



// ===================================
// Swiper 초기화
// ===================================
const visualSwiper = new Swiper('.visual_swiper', {
  loop: true, // 무한 반복
  autoplay: {
    delay: 5000, // 5초마다 자동 넘김
    disableOnInteraction: false, // 사용자가 조작해도 자동재생 유지
  },
  navigation: {
    nextEl: '.swiper-button-next', // 다음 버튼
    prevEl: '.swiper-button-prev', // 이전 버튼
  },
  pagination: {
    el: '.swiper-pagination', // 프로그레스바
    type: 'progressbar',
  },
  on: {
    init: function() {
      // 처음 로드될 때 실행
      const totalSlides = this.slides.length - 2; // loop 모드에서는 앞뒤 복제본 제외
      document.querySelector('.custom-fraction .total').textContent = totalSlides;
    },
    slideChange: function() {
      // 슬라이드가 바뀔 때마다 실행
      const currentSlide = this.realIndex + 1; // realIndex는 0부터 시작하므로 +1
      document.querySelector('.custom-fraction .current').textContent = currentSlide;
    }
  }
});

// ===================================
// 일시정지/재생 버튼 기능
// ===================================
const autoplayToggle = document.getElementById('btn-autoplay-toggle');
const iconPause = document.getElementById('icon-pause');
const iconPlay = document.getElementById('icon-play');

autoplayToggle.addEventListener('click', function() {
  if (visualSwiper.autoplay.running) {
    // 재생 중이면 일시정지
    visualSwiper.autoplay.stop();
    iconPause.classList.add('hidden');
    iconPlay.classList.remove('hidden');
  } else {
    // 일시정지 중이면 재생
    visualSwiper.autoplay.start();
    iconPlay.classList.add('hidden');
    iconPause.classList.remove('hidden');
  }
});

// ===================================
// 커스텀 페이지네이션 박스 기능
// ===================================
const paginationBoxes = document.querySelectorAll('.swiper-pagination-custom li');

paginationBoxes.forEach((box, index) => {
  // 클릭 이벤트 - 해당 슬라이드로 이동
  box.addEventListener('click', function() {
    visualSwiper.slideToLoop(index); // 해당 슬라이드로 이동
    
    // active 클래스 이동
    paginationBoxes.forEach(b => b.classList.remove('active'));
    this.classList.add('active');
  });
  
  // hover 이벤트 - 마우스 올리면 슬라이드 미리보기
  box.addEventListener('mouseenter', function() {
    visualSwiper.slideToLoop(index); // 해당 슬라이드로 이동
  });
});

// Swiper가 슬라이드 변경될 때 active 클래스 동기화
visualSwiper.on('slideChange', function() {
  const realIndex = this.realIndex; // 현재 슬라이드 인덱스 (0부터 시작)
  
  paginationBoxes.forEach((box, index) => {
    if (index === realIndex) {
      box.classList.add('active');
    } else {
      box.classList.remove('active');
    }
  });
});

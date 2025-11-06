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


// 상품분류 아코디언
function initCategoryAccordion() {
    const $cateTitles = $('.cate-title');
    
    $cateTitles.each(function() {
        const $title = $(this);
        
        // 이미 화살표가 있으면 건너뛰기
        if ($title.find('.accordion-arrow').length > 0) return;
        
        // 화살표 HTML 생성
        const arrowHtml = `
            <span class="accordion-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </span>
        `;
        
        // h2에 화살표 추가
        $title.append(arrowHtml);
        
        // 클릭 이벤트 추가
        $title.on('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('클릭됨!'); // 디버깅용
            
            // category-accordion-wrap 찾기
            const $wrapper = $(this).closest('.category-accordion-wrap');
            
            if ($wrapper.length === 0) {
                console.log('wrapper를 찾을 수 없습니다');
                return;
            }
            
            // PC와 태블릿용 메뉴 찾기
            const $pcMenu = $wrapper.find('.display_pc_only .menuCategory.menu');
            const $tabletMenu = $wrapper.find('.display_tablet_only .menuCategory.menu');
            
            console.log('PC 메뉴:', $pcMenu.length, 'Tablet 메뉴:', $tabletMenu.length); // 디버깅용
            
            // active 클래스 토글
            $(this).toggleClass('active');
            
            // 메뉴 표시/숨김 토글
            if ($pcMenu.length > 0) $pcMenu.toggleClass('show');
            if ($tabletMenu.length > 0) $tabletMenu.toggleClass('show');
        });
        
        // 초기 상태: 메뉴 숨김
        const $wrapper = $title.closest('.category-accordion-wrap');
        if ($wrapper.length > 0) {
            $wrapper.find('.display_pc_only .menuCategory.menu').removeClass('show');
            $wrapper.find('.display_tablet_only .menuCategory.menu').removeClass('show');
        }
    });
}

// jQuery ready 내부에서 실행
$(document).ready(function() {
    initCategoryAccordion();
});
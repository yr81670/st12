/* 메인 탭상품 슬라이드 */
$(document).ready(function(){	
  // .tab-slides 존재 여부 확인
    if($('.tab-slides').length > 0) {
        var swiperTabSlides = new Swiper('.tab-slides .swiper-container', {
            roundLengths: true,
            observer: true,
            observeParents: true,
            slidesPerView: 'auto',
            spaceBetween: 0,
            preloadImages: false,
            lazy : {
                loadPrevNext : true,
            },
            scrollbar: {
                el: '.tab-slides .swiper-scrollbar',
                hide: false,
                draggable: true,
            },
            breakpoints: {
                1024: {
                    slidesPerView: 'auto',
                    spaceBetween: 10,
                },
            }
        });
    }
});
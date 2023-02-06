const API_URL = 'https://flax-subsequent-seeker.glitch.me/'

const addPreload = (elem) => {
    elem.classList.add('preload')
}
const removePreload = (elem) => {
    elem.classList.remove('preload')
}

const startSlider= () => {
    const sliderItems = document.querySelectorAll('.slider__item')
    const sliderList = document.querySelector('.slider__list')
    const btnNext = document.querySelector('.slider__arrow_right')
    const btnPrev = document.querySelector('.slider__arrow_left')
    let activeSlide = 1;
    let position = 0;

    const checkSlider =() => {
        if ((activeSlide +2 === sliderItems.length && document.documentElement.offsetWidth > 560) || activeSlide === sliderItems.length ) {
            btnNext.style.display = 'none'
        } else {
            btnNext.style.display = ''
        }

        if (activeSlide===1) {
            btnPrev.style.display = 'none'
        } else{
            btnPrev.style.display = ''
        }
    }
    checkSlider()
    const nextSlide = ()=> {
        sliderItems[activeSlide]?.classList.remove('slider__item-active')
        position = -sliderItems[0].clientWidth*activeSlide
        activeSlide+=1
        sliderList.style.transform=`translateX(${position}px)`
        sliderItems[activeSlide]?.classList.add('slider__item-active')
        checkSlider()
    }
    const prevSlide = ()=> {
        sliderItems[activeSlide]?.classList.remove('slider__item-active')
        position = -sliderItems[0].clientWidth*(activeSlide -2)
        activeSlide-=1
        sliderList.style.transform=`translateX(${position}px)`
        sliderItems[activeSlide]?.classList.add('slider__item-active')
        checkSlider()
    }
    btnNext.addEventListener('click' , nextSlide)
    btnPrev.addEventListener('click' , prevSlide)

    window.addEventListener('resize' , ()=> {
        if(activeSlide +2 > sliderItems.length && document.documentElement.offsetWidth > 560) {
            activeSlide= sliderItems.length - 2
            sliderItems[activeSlide]?.classList.add('slider__item-active')
        }
        position = -sliderItems[0].clientWidth * (activeSlide - 1)
        sliderList.style.transform=`translateX(${position}px)`
        checkSlider()
    })

}
const initSlider = () => {
    const slider = document.querySelector('.slider')
    const sliderContainer = document.querySelector('.slider__container')
    sliderContainer.style.display = 'none'
    addPreload(slider)
    window.addEventListener('load' , ()=> {

        sliderContainer.style.display = ''
        removePreload(slider)
        startSlider(slider)
    })

}
const renderPrice = (wrapper , data) => {
    data.forEach((item) => {
        const priceItem = document.createElement('li')
        priceItem.classList.add('price__item')
        priceItem.innerHTML = `
        <span class="price__item-tittle">${item.name}</span>
        <span class="price__item-count">${item.price}</span>
        `
        wrapper.append(priceItem)
    })
}
const renderService = (wrapper , data) => {
    const labels = data.map(item => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML= `
        <input class="radio__input" type="radio" name="service" value = "${item.id}">
        <span class="radio__label">${item.name}</span>
        `
        return label
    })
    wrapper.append(...labels)
}
const initServise =()=> {
    const priceList = document.querySelector('.price__list')
    const reserveFieldsetService = document.querySelector('.reserve__fieldset_service')
    priceList.textContent = '';
    reserveFieldsetService.innerHTML = ""
    reserveFieldsetService.innerHTML = `
    <legend class="reserve__legend">Услуга</legend>
    `;

    addPreload(priceList)
    addPreload(reserveFieldsetService)
    fetch(`${API_URL}/api`).then((res)=> {
        return res.json();
    }).then(data => {
        renderPrice(priceList,data)
        removePreload(priceList)
        return data
    }).then(data => {
        renderService(reserveFieldsetService, data)
        removePreload(reserveFieldsetService)
    })
}
const addDisabled = (arr) => {
    arr.forEach((item) => {
        item.disabled = true
    })
}
const removeDisabled = (arr) => {
    arr.forEach((item) => {
        item.disabled = false
    })
}
const renderSpec = (wrapper , data) => {
    const labels = data.map(item => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML= `
            <input class="radio__input" type="radio" name="spec" value=${item.id}>
            <span class="radio__label radio__label-spec" style="--bg-image: url(${API_URL}${item.img})">${item.name}</span>
        `
        return label
    })
    wrapper.append(...labels)
}
const renderMonth = (wrapper , data) => {
    const labels = data.map(item => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML= `
        <input class="radio__input" type="radio" name="month" value = "${item}" >
        <span class="radio__label ">
        ${new Intl.DateTimeFormat('ru-Ru', {
            month:'long'
        }).format(new Date(item))}
        </span>
        `
        return label
    })
    wrapper.append(...labels)
}
const renderDay = (wrapper , data , month) => {
    const labels = data.map(item => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML= `
        <input class="radio__input" type="radio" name="day" value = "${item}" >
        <span class="radio__label ">
        ${new Intl.DateTimeFormat('ru-Ru', {
            month:'long' , day:'numeric'
        }).format(new Date(`${month}/${item}`))}
        </span>
        `
        return label
    })
    wrapper.append(...labels)
}
const renderTime = (wrapper , data ) => {
    data.sort((a,b) => a> b ? 1 : -1)
    const labels = data.map(item => {
        const label = document.createElement('label')
        label.classList.add('radio')
        label.innerHTML= `
        <input class="radio__input" type="radio" name="time" value = "${item}" >
        <span class="radio__label ">${item}</span>
        `
        return label
    })
    wrapper.append(...labels)
}
const initReserve = () => {
    const reserveForm = document.querySelector('.reserve__form')
    const {fieldspec, fielddata,fieldmonth,fieldday , fieldtime , btn} = reserveForm

    reserveForm.addEventListener('change' ,async (e)=> {

        const target = e.target
        if (target.name === 'service') {
            addDisabled([
                fieldspec,
                fielddata,
                fieldmonth,
                fieldday,
                fieldtime,
                btn
            ])
            fieldspec.innerHTML = `
            <legend class="reserve__legend">Специалист</legend>`
            addPreload(fieldspec)
            const res = await fetch(`${API_URL}/api/?service=${target.value}`)
            const data = await res.json();
            fieldspec.textContent = ''
            renderSpec(fieldspec , data)
            removePreload(fieldspec)
            removeDisabled([fieldspec])
        }
        if (target.name === 'spec') {
            addDisabled([
                fielddata,
                fieldmonth,
                fieldday,
                fieldtime,
                btn
            ])

            addPreload(fieldmonth)
            const res = await fetch(`${API_URL}/api?spec=${target.value}`)
            const data = await res.json();
            fieldmonth.textContent = '';
            renderMonth(fieldmonth , data)
            removePreload(fieldmonth)
            removeDisabled([fielddata,fieldmonth])
        }
        if (target.name === 'month') {
            addDisabled([
                fieldday,
                fieldtime,
                btn
            ])
            addPreload(fieldday)
            const res = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}`)
            const data = await res.json();
            fieldday.textContent = '';
            renderDay(fieldday , data , reserveForm.month.value)
            removePreload(fieldday)
            removeDisabled([fieldday])
        }
        if (target.name === 'time') {
            addDisabled([
                fieldtime,
                btn
            ])
            addPreload(fieldtime)
            const res = await fetch(`${API_URL}/api?spec=${reserveForm.spec.value}&month=${reserveForm.month.value}&day=${target.value}`)
            const data = await res.json();
            fieldtime.textContent = '';
            renderTime(fieldtime , data )
            removePreload(fieldtime)
            removeDisabled([fieldtime])
        }
        if (target.name === 'time') {
            addDisabled([
                btn
            ])
        }

    })
}
const init = () => {
    initSlider()
    initServise()
    initReserve()
}
init()
window.addEventListener('DOMContentLoaded' , init)

// GET /api - получить список услуг
// GET /api?service={n} - получить список барберов
// GET /api?spec={n} - получить список месяца работы барбера
// GET /api?spec={n}&month={n} - получить список дней работы барбера
// GET /api?spec={n}&month={n}&day={n} - получить список свободных часов барбера
// POST /api/order - оформить заказ


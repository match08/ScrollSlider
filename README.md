# ScrollSlider
Be based on Sly: https://github.com/darsain/sly


npm: npm install https://github.com/match08/ScrollSlider.git --save
  ```
  import ScrollSlider from 'scroll-slider';
  ```
  ```
    let scrollSlider = new ScrollSlider(document.querySelector('.sly'), {
        // prev: '#prev-btn',
        // next: '#next-btn',
        startAt: 0
      },
      {
        active: (e, index) => {
          console.log(index);
  
        }
      });
  ```
  ```
  <div className="horizontal slyWrap">
    <div class"sly">
        <ul>
            <li>
                <a>
                <span>极光幻蓝</span>
                <i className="sprite selcolor-e"></i>
                </a>
            </li>
            <li>
                <a>
                <span>摩卡炫棕</span>
                <i className="sprite selcolor-b"></i>
                </a>
            </li>
            <li>
                <a>
                <span>玛瑙醇红</span>
                <i className="sprite selcolor-d"></i>
                </a>
            </li>
            <li>
                <a>
                <span>珍珠雅白</span>
                <i className="sprite selcolor-f"></i>
                </a>
            </li>
            <li>
                <a>
                <span>砂砾皓灰</span>
                <i className="sprite selcolor-c"></i>
                </a>
            </li>
            <li>
                <a>
                <span>磨砂皓灰</span>
                <i className="sprite selcolor-g"></i>
                </a>
            </li>
        </ul>
    </div>
  </div>
```

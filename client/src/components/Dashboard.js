import React from 'react';
import { useEffect, useState, useContext } from 'react';
import BrandBlock from './atoms/BrandBlock';
import BrandDescription from './atoms/BrandDescription';
import SearchFilter from './atoms/SearchFilter';
import ButtonsBlock from './atoms/ButtonsBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import ModalContext from '../context/modal/modalContext';
import { Motion, spring, presets } from 'react-motion';
import useWindowSize from '../hooks/useWindowSize';
import axios from 'axios';

const Dashboard = () => {
  const [brands, setBrands] = useState([]);
  const [storedBrands, storeBrands] = useState([]);
  const [layoutStyle, setLayout] = useState('brands-grid-container');
  const [windowWidth, windowHeight] = useWindowSize();
  const [startAnimation, setAnimation] = useState(true);
  const initialStyle = { opacity: 0, translateY: 30 };

  const modalContext = useContext(ModalContext);
  const { modal, setModal, hideModal } = modalContext;

  const getBrands = async () => {
    try {
      const res = await axios.get('/api/brands');

      storeBrands(res.data);
      setBrands(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getBrands();
  }, []);

  useEffect(() => {
    if (windowWidth < 1200) {
      setLayout('brands-grid-container');
    }
  }, [windowWidth]);
  const filterBrands = (e) => {
    const filteredBrands = storedBrands.filter((brand) =>
      brand.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    setBrands(filteredBrands);
  };
  const setFlex = () => {
    setLayout('brands-flex-container');
    setAnimation(false);
    setTimeout(function () {
      setAnimation(true);
    }, 10);
  };
  const setGrid = () => {
    setLayout('brands-grid-container');
    setAnimation(false);
    setTimeout(function () {
      setAnimation(true);
    }, 10);
  };
  return (
    <div>
      <div className='dashboard-title'>
        <p>Brands</p>{' '}
        <FontAwesomeIcon
          icon={faEllipsisV}
          className='mobile-menu'
          onClick={() => (modal ? hideModal() : setModal())}
        />
      </div>
      <div className='brands-container'>
        <SearchFilter
          onChange={(e) => filterBrands(e)}
          setGrid={() => setGrid()}
          setFlex={() => setFlex()}
          layoutStyle={layoutStyle}
        />
        <div className={layoutStyle}>
          <ButtonsBlock />
          {brands.length > 0 && startAnimation ? (
            brands.map((brand) => (
              <Motion
                defaultStyle={{
                  opacity: 0,
                  translateY: 30,
                }}
                style={{
                  opacity: spring(1),
                  translateY: spring(0, presets.wobbly),
                }}
              >
                {(interpolatedStyles) => (
                  <div
                    style={
                      layoutStyle === 'brands-flex-container'
                        ? {
                            transform: `translateY(${interpolatedStyles.translateY}px)`,
                            opacity: interpolatedStyles.opacity,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }
                        : {
                            transform: `translateY(${interpolatedStyles.translateY}px)`,
                            opacity: interpolatedStyles.opacity,
                          }
                    }
                  >
                    <BrandBlock
                      key={brand.name}
                      imgUrl={brand.imgUrl}
                      name={brand.name}
                    />
                    {layoutStyle === 'brands-flex-container' && (
                      <BrandDescription />
                    )}
                  </div>
                )}
              </Motion>
            ))
          ) : (
            <Motion
              defaultStyle={{
                opacity: 0,
                translateY: 30,
              }}
              style={{
                opacity: spring(1),
                translateY: spring(0, presets.wobbly),
              }}
            >
              {(interpolatedStyles) => (
                <div
                  style={{
                    transform: `translateY(${interpolatedStyles.translateY}px)`,
                    opacity: interpolatedStyles.opacity,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <p style={{ marginTop: 50, fontStyle: 'italic' }}>
                    Sorry, not found...
                  </p>
                </div>
              )}
            </Motion>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

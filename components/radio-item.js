import { useRef, useEffect } from 'react';

import { useRadioGroupContext, useRadioItemContext } from '@components/radio-group';
import Swatch from '@components/swatch';

export default function RadioItem({ title, value, colors, children, ...rest }) {
  const groupContext = useRadioGroupContext();
  const itemContext = useRadioItemContext();

  const isChecked = groupContext.value === value;
  const itemRef = useRef();
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (isChecked) {
      itemRef.current.focus({ preventScroll: true });
    }
  }, [isChecked]);

  function handleClick() {
    groupContext.onChange(value);
  }

  function handleKeyDown(ev) {
    const { items, onChange } = groupContext;
    const index = itemContext;

    let flag = false;

    // Listen for key presses
    switch (ev.code) {
      case 'Space':
      case 'Enter': {
        onChange(value);
        flag = true;
        break;
      }

      case 'ArrowUp':
      case 'ArrowLeft': {
        onChange(items[wrap(index - 1, items.length)].props.value);
        flag = true;
        break;
      }

      case 'ArrowDown':
      case 'ArrowRight': {
        onChange(items[wrap(index + 1, items.length)].props.value);
        flag = true;
        break;
      }

      default:
        break;
    }

    if (flag) {
      ev.stopPropagation();
      ev.preventDefault();
    }
  }

  return (
    <button
      ref={itemRef}
      role="radio"
      title={title}
      tabIndex={isChecked ? 0 : -1}
      aria-checked={isChecked}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={isChecked ? 'is-active' : ''}
      style={{
        display: "flex",
        }}
      {...rest}
    >
                            
      {/* Render swatches if available, otherwise the value */}
      {colors && colors.length > 0 ? (

        colors.map((color, idx) => (
          <Swatch key={idx} label={title} color={color} />
        ))

      ) : (
        children
      )}

    </button>
  );
}

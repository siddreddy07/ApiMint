'use client';

// The phone and tablet menu, trimmed from React Bits' StaggeredMenu.
import React, { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Logo } from '@/components/logo';
import './StaggeredMenu.css';

// Sheets that slide in ahead of the panel.
const LAYERS = ['#8cefc3', '#0c7352'];

export function StaggeredMenu({
  items = /** @type {{ label: string, link: string }[]} */ ([]),
  footer = /** @type {import('react').ReactNode} */ (null)
}) {
  const [open, setOpen] = useState(false);
  const [textLines, setTextLines] = useState(['Menu']);
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const iconRef = useRef(null);
  const textRef = useRef(null);
  const toggleRef = useRef(null);
  const timelineRef = useRef(null);

  const find = selector => Array.from(rootRef.current.querySelectorAll(selector));

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set('.sm-prelayer, .staggered-menu-panel', { xPercent: 100, opacity: 1 });
      gsap.set('.sm-icon-line-v', { rotate: 90 });
    }, rootRef);
    return () => ctx.revert();
  }, []);

  const animate = useCallback(opening => {
    const layers = find('.sm-prelayer');
    const panel = panelRef.current;

    timelineRef.current?.kill();
    const tl = gsap.timeline();
    timelineRef.current = tl;

    if (opening) {
      layers.forEach((layer, i) => {
        tl.fromTo(layer, { xPercent: 100 }, { xPercent: 0, duration: 0.5, ease: 'power4.out' }, i * 0.07);
      });
      tl.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: 0.65, ease: 'power4.out' }, 0.15)
        .fromTo(
          find('.sm-panel-itemLabel'),
          { yPercent: 140, rotate: 10 },
          { yPercent: 0, rotate: 0, duration: 1, ease: 'power4.out', stagger: 0.1 },
          0.25
        )
        .fromTo(
          find('.sm-panel-item'),
          { '--sm-num-opacity': 0 },
          { '--sm-num-opacity': 1, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
          0.35
        );
    } else {
      tl.to([...layers, panel], { xPercent: 100, duration: 0.32, ease: 'power3.in' });
    }

    gsap.to(iconRef.current, {
      rotate: opening ? 225 : 0,
      duration: opening ? 0.8 : 0.35,
      ease: opening ? 'power4.out' : 'power3.inOut',
      overwrite: 'auto'
    });

    // The label flickers between the two words before settling.
    const from = opening ? 'Menu' : 'Close';
    const to = opening ? 'Close' : 'Menu';
    const lines = [from, to, from, to, to];
    setTextLines(lines);
    gsap.fromTo(
      textRef.current,
      { yPercent: 0 },
      {
        yPercent: -((lines.length - 1) / lines.length) * 100,
        duration: 0.85,
        ease: 'power4.out',
        overwrite: 'auto'
      }
    );
  }, []);

  const setMenu = useCallback(
    next => {
      setOpen(next);
      animate(next);
    },
    [animate]
  );

  // Also hands focus back to the toggle.
  const dismiss = useCallback(() => {
    toggleRef.current?.focus();
    setMenu(false);
  }, [setMenu]);

  React.useEffect(() => {
    if (!open) return;
    const handleKey = event => {
      if (event.key === 'Escape') dismiss();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [open, dismiss]);

  return (
    <div ref={rootRef} className="staggered-menu-wrapper" data-open={open || undefined}>
      <div className="sm-prelayers" aria-hidden="true">
        {LAYERS.map(color => (
          <div key={color} className="sm-prelayer" style={{ background: color }} />
        ))}
      </div>

      <div className="staggered-menu-header">
        <div className="sm-logo">
          <Logo />
        </div>
        <button
          ref={toggleRef}
          className="sm-toggle"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="staggered-menu-panel"
          onClick={() => setMenu(!open)}
          type="button"
        >
          <span className="sm-toggle-textWrap" aria-hidden="true">
            <span ref={textRef} className="sm-toggle-textInner">
              {textLines.map((line, i) => (
                <span className="sm-toggle-line" key={i}>
                  {line}
                </span>
              ))}
            </span>
          </span>
          <span ref={iconRef} className="sm-icon" aria-hidden="true">
            <span className="sm-icon-line" />
            <span className="sm-icon-line sm-icon-line-v" />
          </span>
        </button>
      </div>

      <aside id="staggered-menu-panel" ref={panelRef} className="staggered-menu-panel" inert={!open}>
        <ul className="sm-panel-list" role="list">
          {items.map(item => (
            <li className="sm-panel-itemWrap" key={item.link}>
              <a className="sm-panel-item" href={item.link} onClick={dismiss}>
                <span className="sm-panel-itemLabel">{item.label}</span>
              </a>
            </li>
          ))}
        </ul>
        {footer && (
          <div className="sm-footer" onClick={dismiss}>
            {footer}
          </div>
        )}
      </aside>
    </div>
  );
}

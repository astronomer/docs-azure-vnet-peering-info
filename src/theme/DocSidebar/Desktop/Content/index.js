import React, { useState } from 'react';
import clsx from 'clsx';
import { ThemeClassNames } from '@docusaurus/theme-common';
import {
  useAnnouncementBar,
  useScrollPosition,
} from '@docusaurus/theme-common/internal';
import DocSidebarItems from '@theme/DocSidebarItems';
import styles from './styles.module.css';
function useShowAnnouncementBar() {
  const { isActive } = useAnnouncementBar();
  const [showAnnouncementBar, setShowAnnouncementBar] = useState(isActive);
  useScrollPosition(
    ({ scrollY }) => {
      if (isActive) {
        setShowAnnouncementBar(scrollY === 0);
      }
    },
    [isActive],
  );
  return isActive && showAnnouncementBar;
}
export default function DocSidebarDesktopContent({ path, sidebar, className }) {
  const showAnnouncementBar = useShowAnnouncementBar();
  return (
    <nav
      className={clsx(
        'menu thin-scrollbar',
        styles.menu,
        showAnnouncementBar && styles.menuWithAnnouncementBar,
        className,
      )}>
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list')}>
        <DocSidebarItems items={sidebar} activePath={path} level={1} />
      </ul>
      <ul className={clsx(ThemeClassNames.docs.docSidebarMenu, 'menu__list', styles.menu__listBottom)}>
        <li>
          <a href="https://www.astronomer.io/events/weekly-demo/?utm_source=docs-sidebar">Get a demo</a>
        </li>
        <li>
          <a href="https://www.astronomer.io/events/webinars/?utm_source=docs-sidebar">Watch a webinar</a>
        </li>
        <li>
          <a href="https://status.astronomer.io/?utm_source=docs-sidebar">Astro status</a>
        </li>
      </ul>
    </nav>
  );
}

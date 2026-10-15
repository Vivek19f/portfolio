import { Sparkles, Briefcase, Layers, Gamepad2, Award, BookOpen } from 'lucide-react';
import HomeTab from '../components/tabs/HomeTab';
import ExperienceTab from '../components/tabs/ExperienceTab';
import ProjectsTab from '../components/tabs/ProjectsTab';
import ArcadeTab from '../components/tabs/ArcadeTab';
import AchievementsTab from '../components/tabs/AchievementsTab';
import BlogsTab from '../components/tabs/BlogsTab';

/**
 * Single Source of Truth for Application Navigation & Views.
 * Unifies Header capsule nav, Mobile dock nav, App panel orchestration,
 * Document titles, and CommandPalette navigation.
 */
export const TABS = [
  {
    id: 'home',
    title: 'Vivek Jhooria | Staff Full Stack Engineer',
    labelTop: 'Home',
    labelBottom: 'Landing',
    mobileLabel: 'Home',
    icon: Sparkles,
    component: HomeTab,
    isNav: false,
    displayType: 'contents',
  },
  {
    id: 'experience',
    title: 'Experience | Vivek Jhooria',
    labelTop: 'I Work',
    labelBottom: 'Experience',
    mobileLabel: 'I Work',
    icon: Briefcase,
    component: ExperienceTab,
    isNav: true,
    displayType: 'block',
  },
  {
    id: 'projects',
    title: 'Projects | Vivek Jhooria',
    labelTop: 'I Build',
    labelBottom: 'Projects',
    mobileLabel: 'I Build',
    icon: Layers,
    component: ProjectsTab,
    isNav: true,
    displayType: 'block',
  },
  {
    id: 'arcade',
    title: 'Arcade | Vivek Jhooria',
    labelTop: 'I Play',
    labelBottom: 'Arcade',
    mobileLabel: 'I Play',
    icon: Gamepad2,
    component: ArcadeTab,
    isNav: true,
    displayType: 'block',
  },
  {
    id: 'achievements',
    title: 'Achievements | Vivek Jhooria',
    labelTop: 'I Achieve',
    labelBottom: 'Awards',
    mobileLabel: 'I Achieve',
    icon: Award,
    component: AchievementsTab,
    isNav: true,
    displayType: 'block',
  },
  {
    id: 'blogs',
    title: 'Articles | Vivek Jhooria',
    labelTop: 'I Write',
    labelBottom: 'Articles',
    mobileLabel: 'I Write',
    icon: BookOpen,
    component: BlogsTab,
    isNav: true,
    displayType: 'block',
  },
];

export const TAB_MAP = TABS.reduce((acc, tab) => {
  acc[tab.id] = tab;
  return acc;
}, {});

export const NAV_TABS = TABS.filter((t) => t.isNav);

export function getTabTitle(tabId) {
  return TAB_MAP[tabId]?.title || 'Vivek Jhooria | Staff Full Stack Engineer';
}

import React from 'react';
import PaletteIcon from '@mui/icons-material/Palette';

const TypographyPage = React.lazy(() => import('./pages/Typography'));
const ColorsPage = React.lazy(() => import('./pages/Colors'));
const StatusPage = React.lazy(() => import('./pages/Status'));
const SpacingPage = React.lazy(() => import('./pages/Spacing'));
const ShapePage = React.lazy(() => import('./pages/Shape'));
const IconLibraryPage = React.lazy(() => import('./pages/IconLibrary'));
const SurfacesPage = React.lazy(() => import('./pages/Surfaces'));
const ButtonsPage = React.lazy(() => import('./pages/Buttons'));
const InputsPage = React.lazy(() => import('./pages/Inputs'));
const ChipsPage = React.lazy(() => import('./pages/Chips'));
const TabsPage = React.lazy(() => import('./pages/Tabs'));
const AlertPage = React.lazy(() => import('./pages/Alert'));
const OverridesVsPalettePage = React.lazy(() => import('./pages/OverridesVsPalette'));

export default {
  routes: [
    {
      path: '/style-guide',
      redirect: true,
      to: '/style-guide/typography'
    },
    {
      path: '/style-guide/typography',
      component: TypographyPage,
      title: 'StyleGuideTypography'
    },
    {
      path: '/style-guide/colors',
      component: ColorsPage,
      title: 'StyleGuideColors'
    },
    {
      path: '/style-guide/status',
      component: StatusPage,
      title: 'StyleGuideStatus'
    },
    {
      path: '/style-guide/spacing',
      component: SpacingPage,
      title: 'StyleGuideSpacing'
    },
    {
      path: '/style-guide/shape',
      component: ShapePage,
      title: 'StyleGuideShape'
    },
    {
      path: '/style-guide/icon-library',
      component: IconLibraryPage,
      title: 'StyleGuideIconLibrary'
    },
    {
      path: '/style-guide/surfaces',
      component: SurfacesPage,
      title: 'StyleGuideSurfaces'
    },
    {
      path: '/style-guide/buttons',
      component: ButtonsPage,
      title: 'StyleGuideButtons'
    },
    {
      path: '/style-guide/inputs',
      component: InputsPage,
      title: 'StyleGuideInputs'
    },
    {
      path: '/style-guide/chips',
      component: ChipsPage,
      title: 'StyleGuideChips'
    },
    {
      path: '/style-guide/tabs',
      component: TabsPage,
      title: 'StyleGuideTabs'
    },
    {
      path: '/style-guide/alert',
      component: AlertPage,
      title: 'StyleGuideAlert'
    },
    {
      path: '/style-guide/overrides-vs-palette',
      component: OverridesVsPalettePage,
      title: 'StyleGuideOverridesVsPalette'
    }
  ],
  navigation: [
    {
      id: 'StyleGuide',
      path: '/style-guide',
      icon: <PaletteIcon />
    }
  ]
};

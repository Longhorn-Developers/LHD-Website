/*
 * Every image used on the Home and About pages lives here.
 * To swap an image: put the new file in /public and change its path below.
 * The slideshow at the top of the About page is the exception: it shows
 * everything inside public/about automatically.
 */

export const HOME_IMAGES = {
  // Hero stickers
  heroSticker: "/home_page_images/lhd-original-sticker.png",
  utTower: "/home_page_images/ut_tower_icon.png",
  cowboyHat: "/home_page_images/ut_cowboy_hat.png",
  computerIcon: "/home_page_images/ut_computer_icon.png",
  bevoIcon: "/home_page_images/ut_bevo_icon.png",
  helloWorld: "/home_page_images/ut_hello_world.png",

  // "For students, by students"
  forStudents: "/home_page_images/for_student_by_student.png",

  // Selected Works: UT Registration Plus
  registrationBrowser: "/home_page_images/ut_registration_browser.png",
  registrationExtension: "/home_page_images/ut_registration_chrome_extension.jpg",

  // Selected Works: Mobilize UT
  mobilizeIcon: "/home_page_images/mobilize_ut_icon.png",
  mobilizePhone: "/home_page_images/mobilize_ut_phone.png",

  // Selected Works: Pet Bevo
  bevoIllustration: "/home_page_images/bevo_illustration.png",

  // Selected Works: Longhorn Loop
  longhornLoopIcon: "/home_page_images/longhorn_loop_icon.png",
  longhornLoopPhone: "/home_page_images/longhorn_loop_phone.png",
} as const;

export const ABOUT_IMAGES = {
  // "What we're about" cards
  studentsFirst: "/about/students_first.png",
  openSource: "/about/open_source.png",
  collaborativeEffort: "/about/collaborative_effort.png",
  madeForLonghorns: "/about/made_for_longhorns.png",

  // "How we work"
  howWeWork: "/about/how_we_work.png",

  // Executive board headshots. Leave undefined to show a grey placeholder.
  execKamsi: undefined as string | undefined,
  execKabir: undefined as string | undefined,
  execMiles: undefined as string | undefined,
  execMargaret: undefined as string | undefined,
  execTyler: undefined as string | undefined,
  execClaire: undefined as string | undefined,
};

import React, { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import * as Switch from '@radix-ui/react-switch';
import { Palette, Sun, Moon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme, ThemeColor } from '../hooks/useTheme';

export default function ThemeSettingsPopover() {
  const [activeTab, setActiveTab] = useState<'mode' | 'theme'>('mode');
  const { themeMode, themeColor, setThemeMode, setThemeColor } = useTheme();

  const handleModeChange = (checked: boolean) => {
    setThemeMode(checked ? 'dark' : 'light');
  };

  const handleThemeChange = (color: ThemeColor) => {
    setThemeColor(color);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          className="relative p-2.5 text-stone-700 dark:text-stone-300 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-stone-950 rounded-full transition-all duration-200 focus:outline-none cursor-pointer"
          title="تخصيص السمة والمظهر"
          aria-label="Theme Customization"
          id="global-theme-trigger-btn"
        >
          <Palette className="w-6 h-6 stroke-[2]" />
          <span className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-orange-600 rounded-full border border-white animate-pulse" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-[100] w-80 bg-white dark:bg-stone-900 border border-amber-200/80 dark:border-stone-800 rounded-2xl shadow-xl p-5 text-right overflow-hidden focus:outline-none entry-animation origin-top-left"
          sideOffset={8}
          align="start"
          dir="rtl"
        >
          {/* Header */}
          <div className="flex items-center gap-2 pb-3 mb-4 border-b border-stone-100 dark:border-stone-800">
            <Palette className="w-4 h-4 text-orange-750 dark:text-amber-500" />
            <div>
              <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 leading-none">تخصيص الهوية البصرية</h4>
              <p className="text-[9px] text-stone-500 dark:text-stone-400 mt-1 font-light">تنسيق ألوان ورقمنة منصة آثاري التراثية</p>
            </div>
          </div>

          {/* Elegant RTL Tabs */}
          <div className="flex bg-stone-100 dark:bg-stone-950 p-1 rounded-xl mb-4 gap-1">
            <button
              onClick={() => setActiveTab('mode')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'mode'
                  ? 'bg-white dark:bg-stone-800 text-orange-750 dark:text-amber-500 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              الوضع (مضيء/داكن)
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-white dark:bg-stone-800 text-orange-750 dark:text-amber-500 shadow-xs'
                  : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
              }`}
            >
              سمة الألوان التراثية
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'mode' ? (
              <motion.div
                key="mode-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-100/80 dark:border-stone-850">
                  <div className="flex items-center gap-2">
                    {themeMode === 'dark' ? (
                      <Moon className="w-4 h-4 text-amber-500" />
                    ) : (
                      <Sun className="w-4 h-4 text-orange-600" />
                    )}
                    <span className="text-xs font-bold text-stone-800 dark:text-stone-200">الوضع الداكن</span>
                  </div>

                  {/* Radix Switch styled like Shadcn */}
                  <Switch.Root
                    checked={themeMode === 'dark'}
                    onCheckedChange={handleModeChange}
                    className="w-11 h-6 bg-stone-250 dark:bg-stone-800 rounded-full relative cursor-pointer outline-none focus:ring-2 focus:ring-orange-650 transition-colors data-[state=checked]:bg-orange-700"
                    id="theme-dark-mode-switch"
                  >
                    <Switch.Thumb className="block w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:-translate-x-5.5 rtl:data-[state=checked]:-translate-x-5.5" />
                  </Switch.Root>
                </div>

                <p className="text-[10px] text-stone-500 dark:text-stone-400 leading-relaxed font-light">
                  * يقوم النمط الداكن بتقليل إجهاد العين أثناء قراءة المخطوطات والتحقيق الأثري المتأخر بالليل.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="theme-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.15 }}
                className="space-y-3"
              >
                {/* Custom list of themes */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-0.5 subtle-scrollbar">
                  {/* Theme Option: Default */}
                  <button
                    onClick={() => handleThemeChange('default')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-right cursor-pointer group ${
                      themeColor === 'default'
                        ? 'border-orange-600 bg-orange-50/10 dark:bg-orange-950/15'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#962d15] border border-orange-500/30 flex items-center justify-center shrink-0" />
                      <div>
                        <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">الألوان الكلاسيكية (الافتراضي)</span>
                        <span className="block text-[8px] text-stone-450 dark:text-stone-550 font-light">الهوية البصرية الأصلية للمنصة (العنابي والبيج الأثري)</span>
                      </div>
                    </div>
                    {themeColor === 'default' && (
                      <CheckCircle2 className="w-4 h-4 text-orange-750 dark:text-amber-500" />
                    )}
                  </button>

                  {/* Theme Option: Gold */}
                  <button
                    onClick={() => handleThemeChange('theme-gold')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-right cursor-pointer group ${
                      themeColor === 'theme-gold'
                        ? 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/25'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#c5a565] border border-amber-500/30 flex items-center justify-center shrink-0" />
                      <div>
                        <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">الذهبي الملكي (التراث الصحراوي)</span>
                        <span className="block text-[8px] text-stone-450 dark:text-stone-550 font-light">طراز كوفي عتيق مشبع بألوان الصحراء والذهب اللامع</span>
                      </div>
                    </div>
                    {themeColor === 'theme-gold' && (
                      <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    )}
                  </button>

                  {/* Theme Option: Forest */}
                  <button
                    onClick={() => handleThemeChange('theme-forest')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-right cursor-pointer group ${
                      themeColor === 'theme-forest'
                        ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/25'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#6b9e72] border border-emerald-500/30 flex items-center justify-center shrink-0" />
                      <div>
                        <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">الغابة العشبية</span>
                        <span className="block text-[8px] text-stone-450 dark:text-stone-550 font-light">أشجار خضراء مستوحاة من ريف دمشق والواحات العتيقة</span>
                      </div>
                    </div>
                    {themeColor === 'theme-forest' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    )}
                  </button>

                  {/* Theme Option: Graphite */}
                  <button
                    onClick={() => handleThemeChange('theme-graphite')}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-right cursor-pointer group ${
                      themeColor === 'theme-graphite'
                        ? 'border-stone-600 bg-stone-100/50 dark:bg-stone-950/25'
                        : 'border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-4 h-4 rounded-full bg-[#707070] border border-stone-500/30 flex items-center justify-center shrink-0" />
                      <div>
                        <span className="block text-xs font-bold text-stone-800 dark:text-stone-200">الجرافيت السائل</span>
                        <span className="block text-[8px] text-stone-450 dark:text-stone-550 font-light">طراز فني حديث بلون الحجارة والأقلام الحرة والورق العتيق</span>
                      </div>
                    </div>
                    {themeColor === 'theme-graphite' && (
                      <CheckCircle2 className="w-4 h-4 text-stone-700 dark:text-stone-300" />
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Popover.Arrow className="fill-white dark:fill-stone-900 border-t border-amber-100" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

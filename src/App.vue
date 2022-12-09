<!--
 * @Date: 2022-12-07 16:43:32
 * @LastEditors: chexx
 * @LastEditTime: 2022-12-09 16:15:11
 * @FilePath: \voicesSys\src\App.vue
-->
<template>
  <ConfigProvider :locale="getAntdLocale">
    <!-- 注释 -->
    <AppProvider>
      <RouterView />
    </AppProvider>
  </ConfigProvider>
</template>

<script lang="ts" setup>
  import { ConfigProvider } from 'ant-design-vue';
  import { AppProvider } from '/@/components/Application';
  import { useTitle } from '/@/hooks/web/useTitle';
  import { useLocale } from '/@/locales/useLocale';

  import 'dayjs/locale/zh-cn';
  // support Multi-language
  const { getAntdLocale } = useLocale();

  // Listening to page changes and dynamically changing site titles
  useTitle();
</script>

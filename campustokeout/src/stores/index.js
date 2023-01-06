import { createPinia } from "pinia";
// 进入pinia持久化存储插件
import piniaPluginPersist from "pinia-plugin-persist";
const pinia = createPinia();
// 使用pinia持久化存储插件
pinia.use(piniaPluginPersist);
// 导出pinia
export default pinia;

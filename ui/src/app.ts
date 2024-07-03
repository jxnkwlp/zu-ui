import { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export async function getInitialState(): Promise<{ name?: string }> {
    return {};
}

export const layout: RunTimeLayoutConfig = () => {
    return {
        logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
        menu: {
            locale: false,
        },
        layout: 'top',
        contentWidth: 'Fixed',
    };
};

export const request: RequestConfig = {
    timeout: 5000,
    validateStatus: (status) => status >= 200,
};

import React, { FC } from 'react';
import dynamic from 'next/dynamic';

interface WidgetProps {
    component: string;
    title: string;
    maxWidth?: string; // 반응형으로 너비 조정
}

// 동적으로 Table 컴포넌트 불러오기
const Table = dynamic(() => import('./TableComponents'));
const Pie = dynamic(() => import('./D3PieChart'));

/**
 * 테이블들 타입 설정 끝나고 any에 대한 수정 필요
 */
const components: Record<string, React.ComponentType<any>> = {
    Table: Table ,
    Pie: Pie,
    
};
const Widget: React.FC<WidgetProps> = ({ component, title, maxWidth = "w-60/100" }) => {
    const ComponentToRender = components[component];
    console.log('maxwidth', maxWidth)
    if (!ComponentToRender) {
        return <div>Invalid component specified</div>;
    }

    return (
        <div className={`${maxWidth} border rounded-md shadow-lg bg-white`}>
            <div className="p-4 bg-indigo-600 text-white font-semibold">
                {title}
            </div>
            <div className="p-4">
                <ComponentToRender title={title} maxWidth={maxWidth} />
            </div>
        </div>
    );
};

export default Widget;

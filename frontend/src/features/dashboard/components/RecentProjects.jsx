import React from 'react';
import Button from '../../../components/ui/Button';
import GridSlidesView from '../../slides/components/GridSlidesView';
import { NavLink } from 'react-router-dom';

export const RecentProjects = ({ slides, onEdit, onDelete, onDownload }) => {
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-white">Gần đây</h2>
                <NavLink to='/slides'><Button variant="ghost" size="sm" className="text-purple-300 hover:text-purple-200">Xem tất cả</Button></NavLink>
            </div>

            {slides && slides.length > 0 ? (
                <GridSlidesView slides={slides} onEdit={onEdit} onDelete={onDelete} onDownload={onDownload} />
            ) : (
                <p className="text-gray-400">Bạn chưa có bài thuyết trình nào.</p>

            )}
        </section>
    );
};
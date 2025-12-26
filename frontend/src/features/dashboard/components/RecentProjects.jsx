import React from 'react';
import Button from '../../../components/ui/Button';
import GridSlidesView from '../../slides/components/GridSlidesView';
import { NavLink } from 'react-router-dom';

export const RecentProjects = ({ slides, onDelete, onDownload }) => {
    return (
        <section>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-slate-800">Recent</h2>
                <NavLink to='/slides'><Button variant="ghost" size="sm">View all</Button></NavLink>
            </div>

            {slides && slides.length > 0 ? (
                <GridSlidesView slides={slides} onDelete={onDelete} onDownload={onDownload} />
            ) : (
                <p className="text-slate-500">You don't have any presentations yet.</p>

            )}
        </section>
    );
};
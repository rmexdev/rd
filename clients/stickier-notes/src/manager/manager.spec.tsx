import { render } from '@testing-library/react';

import Manager from './manager';

describe('App', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<Manager />);
        expect(baseElement).toBeTruthy();
    });

    it('should have a greeting as the title', () => {
        const { getAllByText } = render(<Manager />);
        expect(
            getAllByText(new RegExp('Welcome @rd/stickier-notes', 'gi'))
                .length > 0,
        ).toBeTruthy();
    });
});

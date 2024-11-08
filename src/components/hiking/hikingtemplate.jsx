import { hikes } from './hikes';

const hikingTemplate = () => {
    return (
        <div>
            {hikes.map(hike => (
                <HikeCard key={hike.name} hike={hike} />
            ))}
        </div>
    );
};

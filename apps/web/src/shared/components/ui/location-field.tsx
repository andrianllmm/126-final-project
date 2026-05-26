'use client';

import * as React from 'react';

import { reverseGeocodeNominatim } from '@/shared/lib/geocoding/nominatim';
import type { Coordinates } from '@/shared/lib/geocoding/types';

import { Card } from '@/shared/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/shared/components/ui/field';
import { Input } from '@/shared/components/ui/input';
import { Spinner } from '@/shared/components/ui/spinner';
import {
  Map,
  MapControls,
  MapMarker,
  MarkerContent,
  useMap,
} from '@/shared/components/ui/map';
import { UPV_CAMPUS_CENTER } from '@/shared/lib/constants';

export type LocationPoint = {
  type: 'Point';
  coordinates: Coordinates;
};

export type LocationValue = {
  name: string;
  position: LocationPoint;
} | null;

export type LocationFieldProps = {
  value: LocationValue;
  onChange: (value: LocationValue) => void;

  disabled?: boolean;
  className?: string;

  nameLabel?: string;
  mapLabel?: string;
  placeholder?: string;

  initialCenter?: Coordinates;
  initialZoom?: number;

  geocoderEndpoint?: string;
  reverseGeocode?: boolean;

  onBlur?: () => void;
};

function isCoords(value: unknown): value is Coordinates {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    Number.isFinite(value[0]) &&
    Number.isFinite(value[1])
  );
}

function MapClickPicker({ onPick }: { onPick: (coords: Coordinates) => void }) {
  const { map, isLoaded } = useMap();

  React.useEffect(() => {
    if (!isLoaded || !map) {
      return;
    }

    const handleClick = (e: {
      lngLat: {
        lng: number;
        lat: number;
      };
    }) => {
      onPick([e.lngLat.lng, e.lngLat.lat]);
    };

    map.on('click', handleClick);

    return () => {
      map.off('click', handleClick);
    };
  }, [isLoaded, map, onPick]);

  return null;
}

export function LocationField({
  value,
  onChange,

  disabled = false,
  className,

  nameLabel = 'Location name',
  mapLabel = 'Exact location',
  placeholder = 'Enter a location name',

  initialCenter = UPV_CAMPUS_CENTER,
  initialZoom = 12,

  geocoderEndpoint,
  reverseGeocode = true,

  onBlur,
}: LocationFieldProps) {
  const [isResolving, setIsResolving] = React.useState(false);

  const [autoResolvedFor, setAutoResolvedFor] = React.useState<string | null>(
    null,
  );

  const userEditedNameRef = React.useRef(false);

  const coords = value?.position?.coordinates ?? null;
  const name = value?.name ?? '';

  const center = React.useMemo<Coordinates>(() => {
    return isCoords(coords) ? coords : initialCenter;
  }, [coords, initialCenter]);

  React.useEffect(() => {
    if (!name.trim()) {
      userEditedNameRef.current = false;
    }
  }, [name]);

  const updateValue = React.useCallback(
    (nextName: string, nextCoords: Coordinates) => {
      onChange({
        name: nextName,
        position: {
          type: 'Point',
          coordinates: nextCoords,
        },
      });
    },
    [onChange],
  );

  const pickCoords = React.useCallback(
    (nextCoords: Coordinates) => {
      updateValue(name, nextCoords);
    },
    [name, updateValue],
  );

  const handleNameChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      userEditedNameRef.current = true;

      const nextName = e.target.value;

      updateValue(nextName, coords ?? center);
    },
    [center, coords, updateValue],
  );

  React.useEffect(() => {
    if (!reverseGeocode) {
      return;
    }

    if (!coords) {
      return;
    }

    if (disabled) {
      return;
    }

    if (userEditedNameRef.current && name.trim()) {
      return;
    }

    const key = coords.join(',');

    if (autoResolvedFor === key && name.trim()) {
      return;
    }

    const controller = new AbortController();

    const timer = window.setTimeout(async () => {
      try {
        setIsResolving(true);

        const resolvedName = await reverseGeocodeNominatim(coords, {
          endpoint: geocoderEndpoint,
          signal: controller.signal,
        });

        if (!resolvedName) {
          return;
        }

        setAutoResolvedFor(key);

        onChange({
          name: resolvedName,
          position: {
            type: 'Point',
            coordinates: coords,
          },
        });
      } catch {
        // noop
      } finally {
        setIsResolving(false);
      }
    }, 500);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [
    autoResolvedFor,
    coords,
    disabled,
    geocoderEndpoint,
    name,
    onChange,
    reverseGeocode,
  ]);

  return (
    <FieldGroup className={className}>
      <Field>
        <FieldLabel>{nameLabel}</FieldLabel>

        <Input
          value={name}
          onChange={handleNameChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
        />
      </Field>

      <Field>
        <FieldLabel>{mapLabel}</FieldLabel>

        <Card className="h-60 overflow-hidden p-0">
          <Map center={center} zoom={coords ? 14 : initialZoom}>
            <MapControls showZoom showLocate />

            <MapClickPicker onPick={pickCoords} />

            {coords ? (
              <MapMarker
                longitude={coords[0]}
                latitude={coords[1]}
                draggable={!disabled}
                onDragEnd={(lngLat) => {
                  pickCoords([lngLat.lng, lngLat.lat]);
                }}
              >
                <MarkerContent>
                  <span className="block size-5 rounded-full border-2 border-primary-foreground bg-primary shadow" />
                </MarkerContent>
              </MapMarker>
            ) : null}
          </Map>
        </Card>
      </Field>

      {isResolving ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Spinner className="size-4" />
          Detecting location name...
        </div>
      ) : null}
    </FieldGroup>
  );
}

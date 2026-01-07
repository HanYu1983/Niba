import { _decorator, Camera, Component, Vec3, math } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('OrbitCamera')
export class OrbitCamera extends Component {
    @property({ type: Camera })
    public camera: Camera | null = null;

    @property
    public rotateSpeed: number = 0.5;

    @property
    public minPolarAngle: number = 0;

    @property
    public maxPolarAngle: number = Math.PI;

    @property
    public zoomSpeed: number = 1.0;

    @property
    public minDistance: number = 2;

    @property
    public maxDistance: number = 20;

    @property
    public panSpeed: number = 1.0;

    @property
    public enableDamping: boolean = true;

    @property
    public dampingFactor: number = 0.1;

    private _target: Vec3 = new Vec3(0, 0, 0);
    private _distance: number = 10;
    private _azimuthAngle: number = 0;
    private _polarAngle: number = Math.PI / 4;

    private _targetAzimuth: number = 0;
    private _targetPolar: number = Math.PI / 4;
    private _targetDistance: number = 10;
    private _targetPosition: Vec3 = new Vec3(0, 0, 0);

    private _forward: Vec3 = new Vec3();
    private _right: Vec3 = new Vec3();
    private _up: Vec3 = new Vec3();
    private _panOffset: Vec3 = new Vec3();
    private _rightPan: Vec3 = new Vec3();
    private _upPan: Vec3 = new Vec3();

    onLoad(): void {
        if (!this.camera) {
            this.camera = this.getComponent(Camera);
        }

        this._targetAzimuth = this._azimuthAngle;
        this._targetPolar = this._polarAngle;
        this._targetDistance = this._distance;
        this._targetPosition.set(this._target);

        this.updateCameraPosition();
    }

    update(): void {
        if (this.enableDamping) {
            this._azimuthAngle = math.lerp(this._azimuthAngle, this._targetAzimuth, this.dampingFactor);
            this._polarAngle = math.lerp(this._polarAngle, this._targetPolar, this.dampingFactor);
            this._distance = math.lerp(this._distance, this._targetDistance, this.dampingFactor);

            Vec3.lerp(this._target, this._targetPosition, this._target, this.dampingFactor);
        }

        this.updateCameraPosition();
    }

    public rotate(deltaX: number, deltaY: number): void {
        this._targetAzimuth -= deltaX * this.rotateSpeed * 0.01;
        this._targetPolar += deltaY * this.rotateSpeed * 0.01;
        this._targetPolar = math.clamp(this._targetPolar, this.minPolarAngle, this.maxPolarAngle);

        if (!this.enableDamping) {
            this._azimuthAngle = this._targetAzimuth;
            this._polarAngle = this._targetPolar;
        }
    }

    public zoom(delta: number): void {
        this._targetDistance -= delta * this.zoomSpeed * 0.5;
        this._targetDistance = math.clamp(this._targetDistance, this.minDistance, this.maxDistance);

        if (!this.enableDamping) {
            this._distance = this._targetDistance;
        }
    }

    public pan(deltaX: number, deltaY: number): void {
        const cam = this.camera;
        if (!cam) {
            return;
        }
        Vec3.subtract(this._forward, cam.node.worldPosition, this._target);
        this._forward.normalize();

        Vec3.cross(this._right, Vec3.UP, this._forward);
        this._right.normalize();

        Vec3.cross(this._up, this._forward, this._right);
        this._up.normalize();

        const speedFactor = this._distance * this.panSpeed * 0.001;

        Vec3.multiplyScalar(this._rightPan, this._right, -deltaX * speedFactor);
        Vec3.multiplyScalar(this._upPan, this._up, -deltaY * speedFactor);
        Vec3.add(this._panOffset, this._rightPan, this._upPan);
        Vec3.add(this._targetPosition, this._panOffset, this._targetPosition);

        this._target.set(this._targetPosition);
    }

    private updateCameraPosition(): void {
        const cam = this.camera;
        if (!cam) {
            return;
        }

        const x = this._distance * Math.sin(this._polarAngle) * Math.cos(this._azimuthAngle);
        const y = this._distance * Math.cos(this._polarAngle);
        const z = this._distance * Math.sin(this._polarAngle) * Math.sin(this._azimuthAngle);

        cam.node.setWorldPosition(
            this._target.x + x,
            this._target.y + y,
            this._target.z + z
        );

        cam.node.lookAt(this._target, Vec3.UP);
    }

    public setTarget(x: number, y: number, z: number): void {
        this._target.set(x, y, z);
        this._targetPosition.set(x, y, z);
    }

    public getTarget(): Vec3 {
        return this._target.clone();
    }

    public setDistance(distance: number): void {
        this._targetDistance = math.clamp(distance, this.minDistance, this.maxDistance);
        if (!this.enableDamping) {
            this._distance = this._targetDistance;
        }
    }

    public setAngles(azimuth: number, polar: number): void {
        this._targetAzimuth = azimuth;
        this._targetPolar = math.clamp(polar, this.minPolarAngle, this.maxPolarAngle);

        if (!this.enableDamping) {
            this._azimuthAngle = this._targetAzimuth;
            this._polarAngle = this._targetPolar;
        }
    }

    public reset(): void {
        this._targetAzimuth = 0;
        this._targetPolar = Math.PI / 4;
        this._targetDistance = 10;
        this._targetPosition.set(0, 0, 0);

        if (!this.enableDamping) {
            this._azimuthAngle = this._targetAzimuth;
            this._polarAngle = this._targetPolar;
            this._distance = this._targetDistance;
            this._target.set(this._targetPosition);
        }
    }
}
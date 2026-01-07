const { regClass, property } = Laya;

@regClass()
export class OrbitCamera extends Laya.Script {

    @property(Laya.Camera)
    public camera: Laya.Camera;

    // 旋轉設定
    @property(Number)
    public rotateSpeed: number = 0.5;

    @property(Number)
    public minPolarAngle: number = 0; // 最小仰角（弧度）

    @property(Number)
    public maxPolarAngle: number = Math.PI; // 最大仰角（弧度）

    // 縮放設定
    @property(Number)
    public zoomSpeed: number = 1.0;

    @property(Number)
    public minDistance: number = 2;

    @property(Number)
    public maxDistance: number = 20;

    // 平移設定
    @property(Number)
    public panSpeed: number = 1.0;

    @property(Boolean)
    public enableDamping: boolean = true;

    @property(Number)
    public dampingFactor: number = 0.1;

    // 內部狀態
    private target: Laya.Vector3 = new Laya.Vector3(0, 0, 0);
    private distance: number = 10;
    private azimuthAngle: number = 0; // 水平角（方位角）
    private polarAngle: number = Math.PI / 4; // 垂直角（仰角）

    // 阻尼用的目標值
    private targetAzimuth: number = 0;
    private targetPolar: number = Math.PI / 4;
    private targetDistance: number = 10;
    private targetPosition: Laya.Vector3 = new Laya.Vector3(0, 0, 0);

    onAwake(): void {
        if (!this.camera) {
            this.camera = this.owner as Laya.Camera;
        }

        // 初始化目標值
        this.targetAzimuth = this.azimuthAngle;
        this.targetPolar = this.polarAngle;
        this.targetDistance = this.distance;
        this.targetPosition.cloneTo(this.target);

        this.updateCameraPosition();
    }

    onUpdate(): void {
        if (this.enableDamping) {
            // 平滑插值
            this.azimuthAngle = Laya.MathUtil.lerp(this.azimuthAngle, this.targetAzimuth, this.dampingFactor);
            this.polarAngle = Laya.MathUtil.lerp(this.polarAngle, this.targetPolar, this.dampingFactor);
            this.distance = Laya.MathUtil.lerp(this.distance, this.targetDistance, this.dampingFactor);

            Laya.Vector3.lerp(this.target, this.targetPosition, this.dampingFactor, this.target);
        }

        this.updateCameraPosition();
    }

    /**
     * 旋轉相機（提供 delta 值）
     * @param deltaX 水平移動量（像素）
     * @param deltaY 垂直移動量（像素）
     */
    public rotate(deltaX: number, deltaY: number): void {
        this.targetAzimuth -= deltaX * this.rotateSpeed * 0.01;
        this.targetPolar += deltaY * this.rotateSpeed * 0.01;

        // 限制仰角範圍
        this.targetPolar = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, this.targetPolar));

        if (!this.enableDamping) {
            this.azimuthAngle = this.targetAzimuth;
            this.polarAngle = this.targetPolar;
        }
    }

    /**
     * 縮放相機（改變距離）
     * @param delta 滾輪增量（正值拉近，負值拉遠）
     */
    public zoom(delta: number): void {
        this.targetDistance -= delta * this.zoomSpeed * 0.5;
        this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.targetDistance));

        if (!this.enableDamping) {
            this.distance = this.targetDistance;
        }
    }

    /**
     * 平移相機（移動觀察目標點）
     * @param deltaX 水平移動量（像素）
     * @param deltaY 垂直移動量（像素）
     */
    public pan(deltaX: number, deltaY: number): void {
        // 計算相機的右方向和上方向
        const forward = new Laya.Vector3();
        const right = new Laya.Vector3();
        const up = new Laya.Vector3();

        // 從目標點到相機的方向
        Laya.Vector3.subtract(this.camera.transform.position, this.target, forward);
        forward.normalize();

        // 計算右方向（與世界上方向叉乘）
        Laya.Vector3.cross(new Laya.Vector3(0, 1, 0), forward, right);
        right.normalize();

        // 計算上方向
        Laya.Vector3.cross(forward, right, up);
        up.normalize();

        // 平移速度根據距離調整
        const speedFactor = this.distance * this.panSpeed * 0.001;

        // 計算平移向量
        const panOffset = new Laya.Vector3();
        const rightPan = new Laya.Vector3();
        const upPan = new Laya.Vector3();

        Laya.Vector3.scale(right, -deltaX * speedFactor, rightPan);
        Laya.Vector3.scale(up, deltaY * speedFactor, upPan);
        Laya.Vector3.add(rightPan, upPan, panOffset);

        // 更新目標位置
        Laya.Vector3.add(this.targetPosition, panOffset, this.targetPosition);

        // 同時更新 target（阻尼會基於 target 插值）
        this.targetPosition.cloneTo(this.target);
    }

    private updateCameraPosition(): void {

        // 球座標轉笛卡爾座標
        const x = this.distance * Math.sin(this.polarAngle) * Math.cos(this.azimuthAngle);
        const y = this.distance * Math.cos(this.polarAngle);
        const z = this.distance * Math.sin(this.polarAngle) * Math.sin(this.azimuthAngle);

        // 用setValue時，不會更新視圖
        this.camera.transform.position = new Laya.Vector3(
            this.target.x + x,
            this.target.y + y,
            this.target.z + z
        );

        // 讓相機看向目標點
        this.camera.transform.lookAt(this.target, new Laya.Vector3(0, 1, 0));
    }

    /**
     * 設定觀察目標點
     * @param x X 座標
     * @param y Y 座標
     * @param z Z 座標
     */
    public setTarget(x: number, y: number, z: number): void {
        this.target.setValue(x, y, z);
        this.targetPosition.setValue(x, y, z);
    }

    /**
     * 獲取當前觀察目標點
     */
    public getTarget(): Laya.Vector3 {
        return this.target.clone();
    }

    /**
     * 設定相機距離
     * @param distance 距離值
     */
    public setDistance(distance: number): void {
        this.targetDistance = Math.max(this.minDistance, Math.min(this.maxDistance, distance));
        if (!this.enableDamping) {
            this.distance = this.targetDistance;
        }
    }

    /**
     * 設定相機角度
     * @param azimuth 水平角（弧度）
     * @param polar 垂直角（弧度）
     */
    public setAngles(azimuth: number, polar: number): void {
        this.targetAzimuth = azimuth;
        this.targetPolar = Math.max(this.minPolarAngle, Math.min(this.maxPolarAngle, polar));

        if (!this.enableDamping) {
            this.azimuthAngle = this.targetAzimuth;
            this.polarAngle = this.targetPolar;
        }
    }

    /**
     * 重設相機到初始狀態
     */
    public reset(): void {
        this.targetAzimuth = 0;
        this.targetPolar = Math.PI / 4;
        this.targetDistance = 10;
        this.targetPosition.setValue(0, 0, 0);

        if (!this.enableDamping) {
            this.azimuthAngle = this.targetAzimuth;
            this.polarAngle = this.targetPolar;
            this.distance = this.targetDistance;
            this.targetPosition.cloneTo(this.target);
        }
    }
}
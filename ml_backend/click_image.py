import cv2

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to grab frame")
        break
    
    cv2.imshow("Camera", frame)
    key = cv2.waitKey(1)
    if key % 256 == 27:
        # ESC pressed -> exit
        print("Closing camera...")
        break
    elif key % 256 == 32:
        # SPACE pressed -> take snapshot
        img_name = "snapshot.png"
        cv2.imwrite(img_name, frame)
        print(f"Snapshot saved as {img_name}")
        break

cap.release()
cv2.destroyAllWindows()